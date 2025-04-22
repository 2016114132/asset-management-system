import express from 'express';
import { reportsIndex, generateReport } from '../controllers/reportsController';
import { requirePermission } from '../middleware/permissionsMiddleware';

const router = express.Router();

router.get('/', requirePermission('generate-reports'), reportsIndex);
router.post('/', requirePermission('generate-reports'), generateReport);

export default router;
