import { Request, Response, NextFunction } from 'express';

export function mustChangePasswordRedirect(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any).user?.mustChangePassword && req.path !== '/change-password') {
    return res.redirect('/change-password');
  }
  next();
}
