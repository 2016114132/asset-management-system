import db from '../config/db';
import { IRole } from '../interfaces/IRole';

export class Role implements IRole {
  id: number;
  name: string;
  description?: string;

  constructor(data: IRole) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
  }

  static async getAll(): Promise<Role[]> {
    const result = await db.query('SELECT * FROM roles ORDER BY id ASC');
    return result.rows.map(row => new Role(row));
  }

  static async findById(id: number): Promise<Role | null> {
    const result = await db.query('SELECT * FROM roles WHERE id = $1', [id]);
    return result.rows[0] ? new Role(result.rows[0]) : null;
  }

  static async getPermissionIds(roleId: number): Promise<number[]> {
    const result = await db.query('SELECT permission_id FROM role_permissions WHERE role_id = $1', [roleId]);
    return result.rows.map(row => row.permission_id);
  }

  static async create(data: { name: string; description?: string; permission_ids: number[] }): Promise<void> {
    const { name, description, permission_ids } = data;

    const result = await db.query(
      `INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING id`,
      [name, description]
    );

    const roleId = result.rows[0].id;

    for (const pid of permission_ids) {
      await db.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)', [roleId, pid]);
    }
  }

  static async update(id: number, data: { name: string; description?: string; permission_ids: number[] }): Promise<void> {
    const { name, description, permission_ids } = data;

    await db.query(`UPDATE roles SET name = $1, description = $2 WHERE id = $3`, [name, description, id]);
    await db.query(`DELETE FROM role_permissions WHERE role_id = $1`, [id]);

    for (const pid of permission_ids) {
      await db.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)', [id, pid]);
    }
  }

  static async delete(id: number): Promise<void> {
    await db.query('DELETE FROM roles WHERE id = $1', [id]);
  }

  static async getRoleByUserId(userId: number): Promise<Role | null> {
    const result = await db.query(`
      SELECT r.*
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1
      LIMIT 1
    `, [userId]);

    return result.rows[0] ? new Role(result.rows[0]) : null;
  }
}
