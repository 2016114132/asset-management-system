import express from 'express';
import {
  transfersIndex,
  transfersView,
  transfersCreateForm,
  transfersCreate,
  transfersDelete,
  transfersUpdateStatus,
  getAssetDetails
} from '../controllers/transfersController';

import { requirePermission } from '../middleware/permissionsMiddleware';

const router = express.Router();

router.get('/', requirePermission('view-transfers'), transfersIndex);
router.get('/view/:id', requirePermission('view-transfers'), transfersView);
router.get('/create', requirePermission('add-transfers'), transfersCreateForm);
router.post('/create', requirePermission('add-transfers'), transfersCreate);
router.post('/delete/:id', requirePermission('add-transfers'), transfersDelete);
router.post('/update-status/:id', requirePermission('transfers-approval'), transfersUpdateStatus);
router.get('/asset-details/:id', getAssetDetails);

export default router;
