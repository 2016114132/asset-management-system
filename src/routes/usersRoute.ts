import express from 'express';
import {
  usersIndex,
  usersCreateForm,
  usersCreate,
  usersEditForm,
  usersUpdate,
  usersDelete
} from '../controllers/usersController';

import { requirePermission } from '../middleware/permissionsMiddleware';

const router = express.Router();

router.get('/', requirePermission('view-users'), usersIndex);
router.get('/create', requirePermission('add-users'), usersCreateForm);
router.post('/create', requirePermission('add-users'), usersCreate);
router.get('/edit/:id', requirePermission('modify-users'), usersEditForm);
router.post('/edit/:id', requirePermission('modify-users'), usersUpdate);
router.post('/delete/:id', requirePermission('modify-users'), usersDelete);

export default router;
