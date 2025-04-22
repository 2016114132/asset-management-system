import db from '../config/db';
import { IUser } from '../interfaces/IUser';
import bcrypt from 'bcrypt';

export class User implements IUser {
  id: number;
  employee_id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  password_hash: string;
  status: 'Active' | 'Inactive';
  must_change_password: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;

  constructor(data: IUser) {
    this.id = data.id;
    this.employee_id = data.employee_id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.status = data.status;
    this.must_change_password = data.must_change_password;
    this.last_login = data.last_login;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async getAll(): Promise<User[]> {
    const result = await db.query(`
      SELECT u.*, e.first_name, e.last_name, r.name AS role
      FROM users u
      JOIN employees e ON u.employee_id = e.id
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      ORDER BY u.created_at DESC
    `);
  
    return result.rows.map(row => {
      const user = new User(row);
      (user as any).role = row.role;
      return user;
    });
  }
  

  static async findById(id: number): Promise<User | null> {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }

  static async getRoleId(userId: number): Promise<number | null> {
    const result = await db.query('SELECT role_id FROM user_roles WHERE user_id = $1', [userId]);
    return result.rows[0] ? result.rows[0].role_id : null;
  }

  static async createFromEmployee(employee_id: number, email: string, tempPassword: string, role_id: number): Promise<void> {
    const password_hash = await bcrypt.hash(tempPassword, 12);
  
    const result = await db.query(
      `INSERT INTO users (employee_id, email, password_hash, status, must_change_password, created_at, updated_at)
       VALUES ($1, $2, $3, 'Active', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id`,
      [employee_id, email, password_hash]
    );
  
    const userId = result.rows[0].id;
  
    await db.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
      [userId, role_id]
    );
  }

  static async create(data: {
    employee_id: number;
    email: string;
    password_hash: string;
    status?: string;
    role_id: number;
  }): Promise<void> {
    const result = await db.query(
      `INSERT INTO users (employee_id, email, password_hash, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id`,
      [
        data.employee_id,
        data.email,
        data.password_hash,
        data.status || 'Active'
      ]
    );

    const userId = result.rows[0].id;

    await db.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
      [userId, data.role_id]
    );
  }

  static async update(id: number, data: {
    email: string;
    status: string;
    role_id: number;
    password_hash?: string;
  }): Promise<void> {
    if (data.password_hash) {
      await db.query(
        `UPDATE users SET email = $1, password_hash = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4`,
        [data.email, data.password_hash, data.status, id]
      );
    } else {
      await db.query(
        `UPDATE users SET email = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
        [data.email, data.status, id]
      );
    }

    await db.query(`DELETE FROM user_roles WHERE user_id = $1`, [id]);
    await db.query(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`, [id, data.role_id]);
  }

  static async delete(id: number): Promise<void> {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
  }



  static async findByEmail(email: string): Promise<User | null> {
    const result = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  async getRole(): Promise<string> {
    const result = await db.query(
      `SELECT r.name FROM roles r
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id = $1 LIMIT 1`, [this.id]
    );
    return result.rows[0]?.name || 'User';
  }

  async getDisplayName(): Promise<string> {
    const result = await db.query(
      `SELECT first_name, last_name FROM employees WHERE id = (
         SELECT employee_id FROM users WHERE id = $1
       )`, [this.id]
    );
  
    if (result.rows.length > 0) {
      const { first_name, last_name } = result.rows[0];
      return `${first_name} ${last_name}`;
    }
  
    return this.email; // fallback
  }

  static async updatePassword(userId: number, newPassword: string): Promise<void> {
    const hashed = await bcrypt.hash(newPassword, 12);
    await db.query(
      `UPDATE users SET password_hash = $1, must_change_password = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [hashed, userId]
    );
  }
  
}
