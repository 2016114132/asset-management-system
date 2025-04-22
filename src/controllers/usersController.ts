import { Request, Response } from 'express';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Employee } from '../models/Employee';
import bcrypt from 'bcrypt';

const title = 'Users';

export const usersIndex = async (req: Request, res: Response) => {
  try {
    const users = await User.getAll();

    // res.send(users);return;

    res.render('pages/users/index', { title, users });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading users');
    res.redirect('/');
  }
};

export const usersCreateForm = async (req: Request, res: Response) => {
  const roles = await Role.getAll();
  const employees = await Employee.getAll();
  res.render('pages/users/create', { title, roles, employees });
};

export const usersCreate = async (req: Request, res: Response) => {
  try {
    const { employee_id, email, password, role_id, status } = req.body;

    if (!employee_id || !email || !password || !role_id) {
      req.flash('error', 'All fields are required');
      return res.redirect('/users/create');
    }

    const password_hash = await bcrypt.hash(password, 12);

    await User.create({
      employee_id: Number(employee_id),
      email,
      password_hash,
      status,
      role_id: Number(role_id)
    });

    req.flash('success', 'User created successfully');
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error creating user');
    res.redirect('/users/create');
  }
};

export const usersEditForm = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await User.findById(id);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/users');
    }

    const role_id = await User.getRoleId(id);
    const roles = await Role.getAll();
    const employee = await Employee.findById(user.employee_id);

    res.render('pages/users/edit', {
      title,
      user,
      roles,
      role_id,
      employee
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading user');
    res.redirect('/users');
  }
};

export const usersUpdate = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { email, password, status, role_id } = req.body;

    const updateData: any = {
      email,
      status,
      role_id: Number(role_id)
    };

    if (password && password.trim() !== '') {
      updateData.password_hash = await bcrypt.hash(password, 12);
    }

    await User.update(id, updateData);

    req.flash('success', 'User updated successfully');
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating user');
    res.redirect(`/users/edit/${req.params.id}`);
  }
};

export const usersDelete = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await User.delete(id);
    req.flash('success', 'User deleted');
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting user');
    res.redirect('/users');
  }
};
