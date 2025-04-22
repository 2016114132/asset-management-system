import express from 'express';
import {
  campusesIndex,
  campusesCreateForm,
  campusesCreate,
  campusesEditForm,
  campusesUpdate,
  campusesDelete
} from '../controllers/campusesController';

import { requirePermission } from '../middleware/permissionsMiddleware';

const router = express.Router();

router.get('/', requirePermission('view-campuses'), campusesIndex);
router.get('/create', requirePermission('add-campuses'), campusesCreateForm);
router.post('/create', requirePermission('add-campuses'), campusesCreate);
router.get('/edit/:id', requirePermission('modify-campuses'), campusesEditForm);
router.post('/edit/:id', requirePermission('modify-campuses'), campusesUpdate);
router.post('/delete/:id', requirePermission('modify-campuses'), campusesDelete);

export default router;
