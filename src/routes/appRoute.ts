import express from "express"
import { requireAuth } from '../middleware/authMiddleware';
import authRoute from './authRoute';
import { dashboardIndex } from "../controllers/dashboardController"
import assetsRoute from './assetsRoute';
import categoriesRoute from './categoriesRoute';
import requestsRoute from './requestsRoute';
import transfersRoute from './transfersRoute'; 
import employeesRoute from './employeesRoute';
import campusesRoute from './campusesRoute';
import reportRoutes from './reportsRoute'
import usersRoutes from "./usersRoute"
import rolesRoute from "./rolesRoute"

const router = express.Router();

// Auth Routes
router.use('/', authRoute);

// Dashboard Routes
router.get("/dashboard", requireAuth, dashboardIndex);

// Assets Routes
router.use('/assets', requireAuth, assetsRoute);

// Categories Routes
router.use('/categories', requireAuth, categoriesRoute);

// Asset Requests Routes
router.use('/requests', requireAuth, requestsRoute);

// Transfers Routes
router.use('/transfers', requireAuth, transfersRoute);

// Employees Routes
router.use('/employees', requireAuth, employeesRoute);

// Campuses Routes
router.use('/campuses', requireAuth, campusesRoute);

// Reports Routes
router.use('/reports', requireAuth, reportRoutes);

// Users Routes
router.use('/users', requireAuth, usersRoutes);

// Roles Routes
router.use('/roles', requireAuth, rolesRoute);

export default router