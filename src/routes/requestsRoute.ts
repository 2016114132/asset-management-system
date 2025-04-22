import express from 'express';
import {
  requestsIndex,
  requestsView,
  requestsCreateForm,
  requestsCreate,
  requestsDelete,
  requestsUpdateStatus
} from '../controllers/requestsController';

import { requirePermission } from '../middleware/permissionsMiddleware';

const router = express.Router();

router.get('/', requirePermission('view-requests'), requestsIndex);
router.get('/view/:id', requirePermission('view-requests'), requestsView);
router.get('/create', requirePermission('add-requests'), requestsCreateForm);
router.post('/create', requirePermission('add-requests'), requestsCreate);
router.post('/delete/:id', requirePermission('add-requests'), requestsDelete);
router.post('/update-status/:id', requirePermission('requests-approval'), requestsUpdateStatus);

export default router;
