import db from '../config/db';
import bcrypt from 'bcrypt';
import { User } from './User';
import { ILoginCredentials } from '../interfaces/ILoginCredentials';

export class AuthModel {
  static async validateLogin({ email, password }: ILoginCredentials): Promise<User | null> {
    const user = await User.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password_hash);
    return match ? user : null;
  }

  static async updateLastLogin(userId: number): Promise<void> {
    await db.query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [userId]
    );
  }
}
