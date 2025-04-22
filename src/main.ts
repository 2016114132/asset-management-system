import express, {Request, Response, NextFunction} from 'express'
import session from 'express-session';
import flash from 'connect-flash';
import appRoutes from './routes/appRoute'
import { mustChangePasswordRedirect } from './middleware/mustChangePasswordMiddleware';
import { injectPermissions } from './middleware/injectPermissions';
import path from "path"

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "src/public")));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));

app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false
}));

// Make session.user available to every ejs view
app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.session = req.session;
    next();
});

app.use(flash());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.success = (req as any).flash('success');
    res.locals.error = (req as any).flash('error');
    res.locals.warning = (req as any).flash('warning');
    res.locals.info = (req as any).flash('info');
    next();
});

// Force change password middleware
app.use((req, res, next) => {
    const exemptPaths = ['/login', '/logout', '/change-password'];
    if (exemptPaths.includes(req.path)) return next();
    return mustChangePasswordRedirect(req, res, next);
});

// Inject permission so that all .ejs views have access to it
app.use(injectPermissions);

// Pass current path
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});
  

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

app.use(loggingMiddleware);

app.use('/', appRoutes);

// Redirect root to login
app.get('/', (req: Request, res: Response) => {
    res.redirect('/login');
});

app.use((req: Request, res: Response) => {
    res.status(400).send('Page Not Found');
});

const PORT: number = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});