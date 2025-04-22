import { Request, Response, NextFunction } from 'express';
import db from '../config/db';

// Enforces access control at the route level
export const requirePermission = (permissionName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session as any).user?.id;

    if (!userId) {
      res.status(401).send('Unauthorized');
      return;
    }

    const result = await db.query(`
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = $1 AND p.name = $2
      LIMIT 1
    `, [userId, permissionName]);

    if (result.rowCount === 0) {
      res.status(403).send('Forbidden: You do not have permission to access this resource.');
      return;
    }

    next();
  };
};
