import { Request, Response, NextFunction } from 'express';
import db from '../config/db';

// Make list of permission avaialbe to EJS view. (Used to secure front end)
export const injectPermissions = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.session as any).user?.id;
  res.locals.permissions = [];

  if (!userId) return next();

  try {
    const result = await db.query(`
      SELECT p.name FROM permissions p
      JOIN role_permissions rp ON rp.permission_id = p.id
      JOIN user_roles ur ON ur.role_id = rp.role_id
      WHERE ur.user_id = $1
    `, [userId]);

    res.locals.permissions = result.rows.map(r => r.name);
  } catch (err) {
    console.error('Error loading permissions:', err);
  }

  next();
};
