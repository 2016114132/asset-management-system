import db from '../config/db';
import { ICampus } from '../interfaces/ICampus';

export class Campus implements ICampus {
  id: number;
  name: string;
  location?: string;
  totalAssets?: number;

  constructor(data: ICampus) {
    this.id = data.id;
    this.name = data.name;
    this.location = data.location;
    this.totalAssets = data.totalAssets;
  }

  static async getAll(): Promise<Campus[]> {
    const result = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.location,
        COUNT(a.id) AS total_assets
      FROM campuses c
      LEFT JOIN assets a ON a.campus_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    return result.rows.map(row => new Campus({
      id: row.id,
      name: row.name,
      location: row.location,
      totalAssets: Number(row.total_assets)
    }));
  }

  static async findById(id: number): Promise<Campus | null> {
    const result = await db.query('SELECT * FROM campuses WHERE id = $1', [id]);
    return result.rows[0] ? new Campus(result.rows[0]) : null;
  }

  static async create(data: { name: string; location?: string }): Promise<void> {
    await db.query(
      'INSERT INTO campuses (name, location, created_at, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      [data.name, data.location]
    );
  }

  static async update(id: number, data: { name: string; location?: string }): Promise<void> {
    await db.query(
      'UPDATE campuses SET name = $1, location = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [data.name, data.location, id]
    );
  }

  static async delete(id: number): Promise<void> {
    await db.query('DELETE FROM campuses WHERE id = $1', [id]);
  }
}
