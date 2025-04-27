import db from '../config/db';
import { ICategory } from '../interfaces/ICategory';
import DatabaseModel from './DatabaseModel';

export class Category extends DatabaseModel implements ICategory {
  name: string;
  description?: string;
  totalAssets?: number; 

  constructor(data: ICategory) {
    super(data.id, data.created_at, data.updated_at);   
    this.name = data.name;
    this.description = data.description;
    this.totalAssets = data.totalAssets; 
  }

  static async getAll(): Promise<Category[]> {
    const result = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.description,
        COUNT(a.id) AS total_assets
      FROM categories c
      LEFT JOIN assets a ON a.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
  
    return result.rows.map(row => {
      return new Category({
        id: row.id,
        name: row.name,
        description: row.description,
        totalAssets: Number(row.total_assets)
      } as any); 
    });
  }
  

  static async findById(id: number): Promise<Category | null> {
    const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return new Category(result.rows[0]);
  }

  static async delete(id: number): Promise<void> {
    await db.query('DELETE FROM categories WHERE id = $1', [id]);
  }

  static async hasAssets(id: number): Promise<boolean> {
    const result = await db.query('SELECT COUNT(*) FROM assets WHERE category_id = $1', [id]);
    return Number(result.rows[0].count) > 0;
  }

  // Function to save or insert data
  async save(): Promise<boolean> {
    try{
      if(!this.id){
        // New record
        const result = await db.query(
          'INSERT INTO categories (name, description, created_at, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
          [this.name, this.description]
        );

        // Update local instance fields
        this.id = result.rows[0].id;
        this.created_at = result.rows[0].created_at;
        this.updated_at = result.rows[0].updated_at;
      }else{
        // Update existing record
        const result = await db.query(
          'UPDATE categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
          [this.name, this.description, this.id]
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
