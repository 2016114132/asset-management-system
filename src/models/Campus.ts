import db from '../config/db';
import { ICampus } from '../interfaces/ICampus';
import DatabaseModel from './DatabaseModel';

export class Campus extends DatabaseModel implements ICampus {
  name: string;
  location?: string;
  totalAssets?: number;

  constructor(data: ICampus) {
    super(data.id, data.created_at, data.updated_at);
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

  static async delete(id: number): Promise<void> {
    await db.query('DELETE FROM campuses WHERE id = $1', [id]);
  }

  // static async create(data: { name: string; location?: string }): Promise<void> {
  //   await db.query(
  //     'INSERT INTO campuses (name, location, created_at, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
  //     [data.name, data.location]
  //   );
  // }

  // static async update(id: number, data: { name: string; location?: string }): Promise<void> {
  //   await db.query(
  //     'UPDATE campuses SET name = $1, location = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
  //     [data.name, data.location, id]
  //   );
  // }

  // Function to save or insert data
  async save(): Promise<boolean> {
    try{
      if(!this.id){
        // New record
        const result = await db.query(
          'INSERT INTO campuses (name, location, created_at, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
          [this.name, this.location]
        );

        // Update local instance fields
        this.id = result.rows[0].id;
        this.created_at = result.rows[0].created_at;
        this.updated_at = result.rows[0].updated_at;
      }else{
        // Update existing record
        const result = await db.query(
          'UPDATE campuses SET name = $1, location = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
          [this.name, this.location, this.id]
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
