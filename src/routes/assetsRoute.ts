import express from 'express';
import {
  assetsIndex,
  assetsCreateForm,
  assetsCreate,
  assetsEditForm,
  assetsUpdate,
  assetsDelete,
  assetsView
} from '../controllers/assetsController';
import { requirePermission } from '../middleware/permissionsMiddleware';

const router = express.Router();

router.get('/', requirePermission('view-assets'), assetsIndex);
router.get('/create', requirePermission('add-assets'), assetsCreateForm);
router.post('/create', requirePermission('add-assets'), assetsCreate);
router.get('/edit/:id', requirePermission('modify-assets'), assetsEditForm);
router.post('/edit/:id', requirePermission('modify-assets'), assetsUpdate);
router.post('/delete/:id', requirePermission('modify-assets'), assetsDelete);
router.get('/view/:id', requirePermission('view-assets'), assetsView);

export default router;
