export interface IEmployee {
  id?: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email?: string;
  department?: string;
  status: 'Active' | 'Inactive';
  created_at?: string;
  updated_at?: string;
}
