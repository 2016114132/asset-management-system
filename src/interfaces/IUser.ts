export interface IUser {
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
  role?: string; 
}
