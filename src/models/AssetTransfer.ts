import db from '../config/db';
import { IAssetTransfer } from '../interfaces/IAssetTransfer';

export class AssetTransfer implements IAssetTransfer {
  id: number;
  asset_id: number;
  from_campus_id: number;
  to_campus_id: number;
  from_employee_id?: number | null;
  to_employee_id?: number | null;
  reason: string;
  transferred_by: number;
  transferred_at?: string;

  constructor(data: IAssetTransfer) {
    this.id = data.id;
    this.asset_id = data.asset_id;
    this.from_campus_id = data.from_campus_id;
    this.to_campus_id = data.to_campus_id;
    this.from_employee_id = data.from_employee_id ?? null;
    this.to_employee_id = data.to_employee_id ?? null;
    this.reason = data.reason;
    this.transferred_by = data.transferred_by;
    this.transferred_at = data.transferred_at;
  }

  static async getAll(): Promise<any[]> {
    const result = await db.query(`
      SELECT 
        t.*,
        a.asset_tag,
        a.name AS asset_name,
        fc.name AS from_campus_name,
        tc.name AS to_campus_name,
        CONCAT(fe.first_name, ' ', fe.last_name) AS from_employee_name,
        CONCAT(te.first_name, ' ', te.last_name) AS to_employee_name,
        CONCAT(x.first_name, ' ', x.last_name) AS transferred_by_name
      FROM asset_transfers t
      LEFT JOIN assets a ON t.asset_id = a.id
      LEFT JOIN campuses fc ON t.from_campus_id = fc.id
      LEFT JOIN campuses tc ON t.to_campus_id = tc.id
      LEFT JOIN employees fe ON t.from_employee_id = fe.id
      LEFT JOIN employees te ON t.to_employee_id = te.id
      LEFT JOIN employees x ON t.transferred_by = x.id
      ORDER BY t.transferred_at DESC
    `);

    return result.rows;
  }

  static async findById(id: number): Promise<IAssetTransfer | null> {
    const result = await db.query('SELECT * FROM asset_transfers WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(data: Partial<IAssetTransfer>): Promise<void> {
    await db.query(
      `INSERT INTO asset_transfers (
        asset_id, from_campus_id, to_campus_id,
        from_employee_id, to_employee_id, reason,
        transferred_by, transferred_at, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8
      )`,
      [
        data.asset_id,
        data.from_campus_id,
        data.to_campus_id,
        data.from_employee_id ?? null,
        data.to_employee_id ?? null,
        data.reason,
        data.transferred_by,
        data.status || 'Pending'
      ]
    );
  }
  

  static async delete(id: number): Promise<void> {
    await db.query('DELETE FROM asset_transfers WHERE id = $1', [id]);
  }

  static async updateStatus(id: number, status: 'Transferred' | 'Rejected'): Promise<void> {
    await db.query(
      `UPDATE asset_transfers SET status = $1 WHERE id = $2`,
      [status, id]
    );
  }

  static async getRecent(limit: number = 5): Promise<any[]> {
    const result = await db.query(`
      SELECT t.id, t.reason, t.transferred_at, t.status,
             a.asset_tag, a.name AS asset_name,
             f.name AS from_campus, to_c.name AS to_campus
      FROM asset_transfers t
      JOIN assets a ON t.asset_id = a.id
      JOIN campuses f ON t.from_campus_id = f.id
      JOIN campuses to_c ON t.to_campus_id = to_c.id
      ORDER BY t.transferred_at DESC
      LIMIT $1
    `, [limit]);

    return result.rows;
  }
  
}
