import db from '../config/db';
import { IEmployee } from '../interfaces/IEmployee';
import DatabaseModel from './DatabaseModel';

export class Employee extends DatabaseModel implements IEmployee {
  employee_code: string;
  first_name: string;
  last_name: string;
  email?: string;
  department?: string;
  status: 'Active' | 'Inactive';

  constructor(data: IEmployee) {
    super(data.id, data.created_at, data.updated_at);

    this.employee_code = data.employee_code;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.email = data.email;
    this.department = data.department;
    this.status = data.status;
  }

  static async getAll(): Promise<Employee[]> {
    const result = await db.query('SELECT * FROM employees ORDER BY created_at DESC');
    return result.rows.map(row => new Employee(row));
  }

  static async getAllWithNoUser(): Promise<Employee[]> {
    // const result = await db.query('SELECT * FROM employees ORDER BY created_at DESC');
    const result = await db.query(`
      SELECT *
      FROM employees
      WHERE id NOT IN (SELECT employee_id FROM users WHERE employee_id IS NOT NULL)
      ORDER BY first_name ASC
    `);
    
    return result.rows.map(row => new Employee(row));
  }

  static async findById(id: number): Promise<Employee | null> {
    const result = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
    return result.rows[0] ? new Employee(result.rows[0]) : null;
  }

  static async delete(id: number): Promise<void> {
    await db.query('DELETE FROM employees WHERE id = $1', [id]);
  }

  static async generateNextCode(): Promise<string> {
    const prefix = 'EMP-';
  
    const result = await db.query(
      `SELECT employee_code FROM employees WHERE employee_code LIKE $1 ORDER BY employee_code DESC LIMIT 1`,
      [`${prefix}%`]
    );
  
    let nextNumber = 1;
  
    if (result.rows.length > 0) {
      const lastCode = result.rows[0].employee_code;
      const parts = lastCode.split('-');
      const lastNum = parseInt(parts[1]);
      if (!isNaN(lastNum)) nextNumber = lastNum + 1;
    }
  
    const formatted = String(nextNumber).padStart(5, '0');
    return `${prefix}${formatted}`;
  }

  // static async create(data: Partial<IEmployee>): Promise<number> {
  //   const result = await db.query(
  //     `INSERT INTO employees (employee_code, first_name, last_name, email, department, status, created_at, updated_at)
  //      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  //      RETURNING id`,
  //     [
  //       data.employee_code,
  //       data.first_name,
  //       data.last_name,
  //       data.email,
  //       data.department,
  //       data.status || 'Active'
  //     ]
  //   );
  
  //   return result.rows[0].id;
  // }
  

  // static async update(id: number, data: Partial<IEmployee>): Promise<void> {
  //   await db.query(
  //     `UPDATE employees SET
  //       employee_code = $1,
  //       first_name = $2,
  //       last_name = $3,
  //       email = $4,
  //       department = $5,
  //       status = $6,
  //       updated_at = CURRENT_TIMESTAMP
  //      WHERE id = $7`,
  //     [
  //       data.employee_code,
  //       data.first_name,
  //       data.last_name,
  //       data.email,
  //       data.department,
  //       data.status,
  //       id
  //     ]
  //   );
  // }
  

  // Function to save or insert data
  async save(): Promise<boolean> {
    try{
      if(!this.id){
        // New record
        const result = await db.query(
          `INSERT INTO employees (employee_code, first_name, last_name, email, department, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
           RETURNING *`,
          [
            this.employee_code,
            this.first_name,
            this.last_name,
            this.email,
            this.department,
            this.status || 'Active'
          ]
        );

        // Update local instance fields
        this.id = result.rows[0].id;
        this.created_at = result.rows[0].created_at;
        this.updated_at = result.rows[0].updated_at;
      }else{
        // Update existing record
        const result = await db.query(
          `UPDATE employees SET
            employee_code = $1,
            first_name = $2,
            last_name = $3,
            email = $4,
            department = $5,
            status = $6,
            updated_at = CURRENT_TIMESTAMP
           WHERE id = $7
           RETURNING *`,
          [
            this.employee_code,
            this.first_name,
            this.last_name,
            this.email,
            this.department,
            this.status,
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
