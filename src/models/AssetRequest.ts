import db from '../config/db';
import { IAssetRequest } from '../interfaces/IAssetRequest';

export class AssetRequest implements IAssetRequest {
  id: number;
  request_type: 'New' | 'Replacement' | 'Repair' | 'Disposal';
  asset_id?: number | null;
  description: string;
  status: 'Pending' | 'Approved' | 'Denied';
  requested_by: number;
  submitted_at?: string;

  constructor(data: IAssetRequest) {
    this.id = data.id;
    this.request_type = data.request_type;
    this.asset_id = data.asset_id;
    this.description = data.description;
    this.status = data.status;
    this.requested_by = data.requested_by;
    this.submitted_at = data.submitted_at;
  }

  static async getAll(employeeId?: number): Promise<any[]> {
    const result = employeeId
      ? await db.query(`
          SELECT 
            ar.*,
            CONCAT(e.first_name, ' ', e.last_name) AS requested_by_name,
            a.name AS asset_name
          FROM asset_requests ar
          LEFT JOIN employees e ON ar.requested_by = e.id
          LEFT JOIN assets a ON ar.asset_id = a.id
          WHERE ar.requested_by = $1
          ORDER BY ar.submitted_at DESC
        `, [employeeId])
      : await db.query(`
          SELECT 
            ar.*,
            CONCAT(e.first_name, ' ', e.last_name) AS requested_by_name,
            a.name AS asset_name
          FROM asset_requests ar
          LEFT JOIN employees e ON ar.requested_by = e.id
          LEFT JOIN assets a ON ar.asset_id = a.id
          ORDER BY ar.submitted_at DESC
        `);
  
    return result.rows;
  }
  

  static async findById(id: number): Promise<IAssetRequest | null> {
    const result = await db.query('SELECT * FROM asset_requests WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(data: Partial<IAssetRequest>): Promise<void> {
    await db.query(
      `INSERT INTO asset_requests 
        (request_type, asset_id, description, status, requested_by, submitted_at)
       VALUES 
        ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
      [
        data.request_type,
        data.asset_id ?? null,
        data.description,
        data.status || 'Pending',
        data.requested_by
      ]
    );
  }

  static async update(id: number, data: Partial<IAssetRequest>): Promise<void> {
    await db.query(
      `UPDATE asset_requests SET 
        request_type = $1,
        asset_id = $2,
        description = $3,
        status = $4,
        requested_by = $5
       WHERE id = $6`,
      [
        data.request_type,
        data.asset_id ?? null,
        data.description,
        data.status,
        data.requested_by,
        id
      ]
    );
  }

  static async delete(id: number): Promise<void> {
    await db.query('DELETE FROM asset_requests WHERE id = $1', [id]);
  }

  static async getRecent(limit: number = 5): Promise<any[]> {
    const result = await db.query(`
      SELECT id, request_type, status, submitted_at
      FROM asset_requests
      ORDER BY submitted_at DESC
      LIMIT $1
    `, [limit]);

    return result.rows;
  }
}
