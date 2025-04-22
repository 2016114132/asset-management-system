import express from 'express';
import {
  categoriesIndex,
  categoriesCreateForm,
  categoriesCreate,
  categoriesEditForm,
  categoriesUpdate,
  categoriesDelete
} from '../controllers/categoriesController';
import { requirePermission } from '../middleware/permissionsMiddleware';

const router = express.Router();

router.get('/', requirePermission('view-categories'), categoriesIndex);
router.get('/create', requirePermission('add-categories'), categoriesCreateForm);
router.post('/create', requirePermission('add-categories'), categoriesCreate);
router.get('/edit/:id', requirePermission('modify-categories'), categoriesEditForm);
router.post('/edit/:id', requirePermission('modify-categories'), categoriesUpdate);
router.post('/delete/:id', requirePermission('modify-categories'), categoriesDelete);

export default router;
