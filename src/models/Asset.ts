import db from '../config/db';
import { IAsset } from '../interfaces/IAsset';
import DatabaseModel from './DatabaseModel';

export class Asset extends DatabaseModel implements IAsset {
  asset_tag: string;
  name: string;
  category_id: number;
  campus_id: number;
  condition: string;
  status: string;
  purchase_date?: string;
  assigned_to?: number | null;

  constructor(data: IAsset) {
    super(data.id, data.created_at, data.updated_at);

    this.asset_tag = data.asset_tag;
    this.name = data.name;
    this.category_id = data.category_id;
    this.campus_id = data.campus_id;
    this.condition = data.condition;
    this.status = data.status;
    this.purchase_date = data.purchase_date;
    this.assigned_to = data.assigned_to ?? null;
  }

  static async getAll(employeeId?: number): Promise<any[]> {
    const result = employeeId
      ? await db.query(`
          SELECT 
            a.*,
            c.name AS category_name,
            ca.name AS campus_name,
            CONCAT(e.first_name, ' ', e.last_name) AS assigned_to_name
          FROM assets a
          LEFT JOIN categories c ON a.category_id = c.id
          LEFT JOIN campuses ca ON a.campus_id = ca.id
          LEFT JOIN employees e ON a.assigned_to = e.id
          WHERE a.assigned_to = $1
          ORDER BY a.asset_tag ASC
        `, [employeeId])
      : await db.query(`
          SELECT 
            a.*,
            c.name AS category_name,
            ca.name AS campus_name,
            CONCAT(e.first_name, ' ', e.last_name) AS assigned_to_name
          FROM assets a
          LEFT JOIN categories c ON a.category_id = c.id
          LEFT JOIN campuses ca ON a.campus_id = ca.id
          LEFT JOIN employees e ON a.assigned_to = e.id
          ORDER BY a.asset_tag ASC
        `);
  
    return result.rows;
  }

  static async findById(id: number): Promise<Asset | null> {
    const result = await db.query('SELECT * FROM assets WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return null;
    }

    // Create and return an instance of this model
    return new Asset(result.rows[0]);
  }

  static async delete(id: number): Promise<void> {
    await db.query('DELETE FROM assets WHERE id = $1', [id]);
  }

  static async generateNextTag(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `UB-${year}-`;
  
    const result = await db.query(
      `SELECT asset_tag FROM assets WHERE asset_tag LIKE $1 ORDER BY asset_tag DESC LIMIT 1`,
      [`${prefix}%`]
    );
  
    let nextNumber = 1;
  
    if (result.rows.length > 0) {
      const lastTag = result.rows[0].asset_tag;
      const parts = lastTag.split('-');
      const lastNum = parseInt(parts[2]);
      if (!isNaN(lastNum)) nextNumber = lastNum + 1;
    }
  
    const formatted = String(nextNumber).padStart(3, '0');
    return `${prefix}${formatted}`;
  }

  static async updateStatus(assetId: number, status: string): Promise<void> {
    await db.query(`UPDATE assets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [status, assetId]);
  }
  
  static async updateTransferDetails(id: number, campusId: number, employeeId?: number | null): Promise<void> {
    await db.query(
      `UPDATE assets SET campus_id = $1, assigned_to = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
      [campusId, employeeId ?? null, id]
    );
  }
  
  // Function to save or insert data
  async save(): Promise<boolean> {
    try{
      if(!this.id){
        // New record
        const result = await db.query(
          `INSERT INTO assets 
            (asset_tag, name, category_id, campus_id, condition, status, purchase_date, assigned_to, created_at, updated_at)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *`,
          [
            this.asset_tag,
            this.name,
            this.category_id,
            this.campus_id,
            this.condition,
            this.status,
            this.purchase_date || null,
            this.assigned_to || null
          ]
        );

        // Update local instance fields
        this.id = result.rows[0].id;
        this.created_at = result.rows[0].created_at;
        this.updated_at = result.rows[0].updated_at;
      }else{
        // Update existing record
        const result = await db.query(
          `UPDATE assets SET 
            asset_tag = $1,
            name = $2,
            category_id = $3,
            campus_id = $4,
            condition = $5,
            status = $6,
            purchase_date = $7,
            assigned_to = $8,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $9
          RETURNING *`,
          [
            this.asset_tag,
            this.name,
            this.category_id,
            this.campus_id,
            this.condition,
            this.status,
            this.purchase_date || null,
            this.assigned_to || null,
            this.id
          ]
        );

        // Update instance fields
        this.updated_at = result.rows[0].updated_at;
      }

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
