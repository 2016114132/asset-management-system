import { Request, Response } from 'express';
import { Employee } from '../models/Employee';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { generateTempPassword } from '../utils/passwordGenerator';
import { sendWelcomeEmail } from '../utils/mailer';

const title = 'Employees';

export const employeesIndex = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.getAll();

    res.render('pages/employees/index', {
      title, 
      employees
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading employees');
    res.redirect('/');
  }
};

export const employeesCreateForm = async (req: Request, res: Response) => {
  const nextCode = await Employee.generateNextCode();
  const roles = await Role.getAll();

  res.render('pages/employees/create', {
    title,
    generatedCode: nextCode,
    roles
  });
};


export const employeesCreate = async (req: Request, res: Response) => {
  try {
    const { employee_code, first_name, last_name, email, department, status, create_user } = req.body;

    if (!employee_code || !first_name || !last_name) {
      req.flash('error', 'Employee Code, First Name and Last Name are required');
      return res.redirect('/employees/create');
    }

    // Create new instance of object
    const employee = new Employee({
      employee_code,
      first_name,
      last_name,
      email,
      department,
      status: status || 'Active'
    });

    // Save the instance
    const saved = await employee.save();

    if(!saved){
      (req as any).flash('error', 'Unable to create employee');
      return res.redirect('/employees/create');
    }       

    req.flash('success', 'Employee created successfully');

    if (create_user === '1' && email) {
      const roleId = req.body.role_id || 4; // default to Employee role
      const tempPassword = generateTempPassword();

      await User.createFromEmployee(employee.id ?? 0, email, tempPassword, roleId); 

      // Log & email
      console.log(`Send welcome email to ${email} with temp password: ${tempPassword}`);
      await sendWelcomeEmail(email, tempPassword);

      req.flash('info', `User created with temporary password. Email: ${email}`);
    }

    res.redirect('/employees');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error creating employee.');
    res.redirect('/employees/create');
  }
};

export const employeesEditForm = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const employee = await Employee.findById(id);

    if (!employee) {
      req.flash('error', 'Employee not found');
      return res.redirect('/employees');
    }

    res.render('pages/employees/edit', {
      title,
      employee
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading employee');
    res.redirect('/employees');
  }
};

export const employeesUpdate = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { employee_code, first_name, last_name, email, department, status } = req.body;

    if (!employee_code || !first_name || !last_name) {
      req.flash('error', 'Employee Code, First Name and Last Name are required');
      res.redirect(`/employees/edit/${req.params.id}`);
    }

    // await Employee.update(id, {
    //   employee_code,
    //   first_name,
    //   last_name,
    //   email,
    //   department,
    //   status
    // });

    // Create new instance of object
    const employee = new Employee({
      id,
      employee_code,
      first_name,
      last_name,
      email,
      department,
      status: status
    });
 
    // Save the instance
    const saved = await employee.save();

    if(!saved){
      (req as any).flash('error', 'Unable to edit employee');
      res.redirect(`/employees/edit/${req.params.id}`);
    }    

    req.flash('success', 'Employee updated successfully');
    res.redirect('/employees');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating employee');
    res.redirect(`/employees/edit/${req.params.id}`);
  }
};

export const employeesDelete = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await Employee.delete(id);
    req.flash('success', 'Employee deleted');
    res.redirect('/employees');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting employee');
    res.redirect('/employees');
  }
};
