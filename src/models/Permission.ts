import db from '../config/db';
import { IPermission } from '../interfaces/IPermission';

export class Permission implements IPermission {
  id: number;
  name: string;
  description?: string;
  module: string;

  constructor(data: IPermission) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.module = data.module;
  }

  static async getAll(): Promise<Permission[]> {
    const result = await db.query('SELECT * FROM permissions ORDER BY module, name');
    return result.rows.map(row => new Permission(row));
  }

  static async findById(id: number): Promise<Permission | null> {
    const result = await db.query('SELECT * FROM permissions WHERE id = $1', [id]);
    return result.rows[0] ? new Permission(result.rows[0]) : null;
  }

  static async findByModule(module: string): Promise<Permission[]> {
    const result = await db.query('SELECT * FROM permissions WHERE module = $1 ORDER BY name', [module]);
    return result.rows.map(row => new Permission(row));
  }
}
