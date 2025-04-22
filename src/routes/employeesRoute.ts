import express from 'express';
import {
  employeesIndex,
  employeesCreateForm,
  employeesCreate,
  employeesEditForm,
  employeesUpdate,
  employeesDelete
} from '../controllers/employeesController';

import { requirePermission } from '../middleware/permissionsMiddleware';

const router = express.Router();

router.get('/', requirePermission('view-employees'), employeesIndex);
router.get('/create', requirePermission('add-employees'), employeesCreateForm);
router.post('/create', requirePermission('add-employees'), employeesCreate);
router.get('/edit/:id', requirePermission('modify-employees'), employeesEditForm);
router.post('/edit/:id', requirePermission('modify-employees'), employeesUpdate);
router.post('/delete/:id', requirePermission('modify-employees'), employeesDelete);

export default router;
