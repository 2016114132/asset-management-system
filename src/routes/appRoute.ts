import express from "express"
import { dashboardIndex } from "../controllers/dashboardController"
import { assetsIndex } from "../controllers/assetsController"
import { categoriesIndex } from "../controllers/categoriesController"
import { requestsIndex } from "../controllers/requestsController"
import { transfersIndex } from "../controllers/transfersController"
import { employeesIndex } from "../controllers/employeesController"
import { campusesIndex } from "../controllers/campusesController"
import { reportsIndex } from "../controllers/reportsController"
import { usersIndex } from "../controllers/usersController"
import { rolesIndex } from "../controllers/rolesController"

const router = express.Router();

// Dashboard Routes
router.get("/dashboard", dashboardIndex);

// Assets Routes
router.get("/assets", assetsIndex);

// Categories Routes
router.get("/categories", categoriesIndex);

// Asset Requests Routes
router.get("/requests", requestsIndex);

// Transfers Routes
router.get("/transfers", transfersIndex);

// Employees Routes
router.get("/employees", employeesIndex);

// Campuses Routes
router.get("/campuses", campusesIndex);

// Reports Routes
router.get("/reports", reportsIndex);

// Users Routes
router.get("/users", usersIndex);

// Roles Routes
router.get("/roles", rolesIndex);

export default router