import db from '../config/db';
import { IEmployee } from '../interfaces/IEmployee';

export class Employee implements IEmployee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email?: string;
  department?: string;
  status: 'Active' | 'Inactive';
  created_at?: string;
  updated_at?: string;

  constructor(data: IEmployee) {
    this.id = data.id;
    this.employee_code = data.employee_code;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.email = data.email;
    this.department = data.department;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async getAll(): Promise<Employee[]> {
    const result = await db.query('SELECT * FROM employees ORDER BY created_at DESC');
    return result.rows.map(row => new Employee(row));
  }

  static async findById(id: number): Promise<Employee | null> {
    const result = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
    return result.rows[0] ? new Employee(result.rows[0]) : null;
  }

  static async create(data: Partial<IEmployee>): Promise<number> {
    const result = await db.query(
      `INSERT INTO employees (employee_code, first_name, last_name, email, department, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id`,
      [
        data.employee_code,
        data.first_name,
        data.last_name,
        data.email,
        data.department,
        data.status || 'Active'
      ]
    );
  
    return result.rows[0].id;
  }
  

  static async update(id: number, data: Partial<IEmployee>): Promise<void> {
    await db.query(
      `UPDATE employees SET
        employee_code = $1,
        first_name = $2,
        last_name = $3,
        email = $4,
        department = $5,
        status = $6,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $7`,
      [
        data.employee_code,
        data.first_name,
        data.last_name,
        data.email,
        data.department,
        data.status,
        id
      ]
    );
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
  
}
