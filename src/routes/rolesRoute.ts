import express from 'express';
import {
  rolesIndex,
  rolesCreateForm,
  rolesCreate,
  rolesEditForm,
  rolesUpdate,
  rolesDelete
} from '../controllers/rolesController';

import { requirePermission } from '../middleware/permissionsMiddleware';

const router = express.Router();

router.get('/', requirePermission('view-roles'), rolesIndex);
router.get('/create', requirePermission('add-roles'), rolesCreateForm);
router.post('/create', requirePermission('add-roles'), rolesCreate);
router.get('/edit/:id', requirePermission('modify-roles'), rolesEditForm);
router.post('/edit/:id', requirePermission('modify-roles'), rolesUpdate);
router.post('/delete/:id', requirePermission('modify-roles'), rolesDelete);

export default router;
