import { Request, Response } from 'express';
import { AuthModel } from '../models/AuthModel';
import { User } from '../models/User';

export const getLogin = (req: Request, res: Response) => {
  if ((req.session as any).user) {
    return res.redirect('/dashboard');
  }
  
  res.render('pages/login/index', { error: null });
};

export const postLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await AuthModel.validateLogin({ email, password });

  if (!user) {
    return res.status(401).render('pages/login/index', { error: 'Invalid email or password.' });
  }

  // Load role from model
  const role = await user.getRole();

  // Get display name
  const displayName = await user.getDisplayName();

  await AuthModel.updateLastLogin(user.id);

  if (user.must_change_password) {
    (req.session as any).user = {
      id: user.id,
      email: user.email,
      role,
      displayName,
      mustChangePassword: true,
      employee_id: user.employee_id
    };
    return res.redirect('/change-password');
  } else {
    (req.session as any).user = {
      id: user.id,
      email: user.email,
      role,
      displayName,
      mustChangePassword: false,
      employee_id: user.employee_id
    };
    return res.redirect('/dashboard');
  }

};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

export const showChangePassword = (req: Request, res: Response) => {
  res.render('pages/auth/change-password', { title: 'Change Password' });
};

export const updatePassword = async (req: Request, res: Response) => {
  const userId = (req.session as any).user?.id;
  const { new_password, confirm_password } = req.body;

  if (!new_password || new_password !== confirm_password) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/change-password');
  }

  await User.updatePassword(userId, new_password);

  (req.session as any).user.mustChangePassword = false;
  req.flash('success', 'Password updated successfully');
  res.redirect('/dashboard');
};