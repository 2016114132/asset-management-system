import db from '../config/db';
import { ICategory } from '../interfaces/ICategory';

export class Category implements ICategory {
  id: number;
  name: string;
  description?: string;
  totalAssets?: number; 

  constructor(category: ICategory) {
    this.id = category.id;
    this.name = category.name;
    this.description = category.description;
    this.totalAssets = category.totalAssets; 
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
    return result.rows[0] ? new Category(result.rows[0]) : null;
  }

  static async create(data: { name: string; description?: string }): Promise<void> {
    await db.query(
      'INSERT INTO categories (name, description, created_at, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      [data.name, data.description]
    );
  }

  static async update(id: number, data: { name: string; description?: string }): Promise<void> {
    await db.query(
      'UPDATE categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [data.name, data.description, id]
    );
  }

  static async delete(id: number): Promise<void> {
    await db.query('DELETE FROM categories WHERE id = $1', [id]);
  }

  static async hasAssets(id: number): Promise<boolean> {
    const result = await db.query('SELECT COUNT(*) FROM assets WHERE category_id = $1', [id]);
    return Number(result.rows[0].count) > 0;
  }
}
