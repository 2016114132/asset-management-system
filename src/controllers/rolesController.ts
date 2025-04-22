import { Request, Response } from 'express';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

const title = 'Roles';

export const rolesIndex = async (req: Request, res: Response) => {
  try {
    const roles = await Role.getAll();
    res.render('pages/roles/index', { title, roles });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading roles');
    res.redirect('/');
  }
};

export const rolesCreateForm = async (req: Request, res: Response) => {
  const permissions = await Permission.getAll();
  res.render('pages/roles/create', { title, permissionsList: permissions });
};

export const rolesCreate = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const permission_ids = Array.isArray(req.body.permission_ids)
      ? req.body.permission_ids.map(Number)
      : req.body.permission_ids
      ? [Number(req.body.permission_ids)]
      : [];

    if (!name || name.trim() === '') {
      req.flash('error', 'Role name is required');
      return res.redirect('/roles/create');
    }

    await Role.create({ name, description, permission_ids });

    req.flash('success', 'Role created successfully');
    res.redirect('/roles');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error creating role');
    res.redirect('/roles/create');
  }
};

export const rolesEditForm = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const role = await Role.findById(id);
    if (!role) {
      req.flash('error', 'Role not found');
      return res.redirect('/roles');
    }

    const permissions = await Permission.getAll();
    const assignedPermissionIds = await Role.getPermissionIds(id);

    res.render('pages/roles/edit', {
      title,
      role,
      permissionsList: permissions,
      assignedPermissionIds
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading role');
    res.redirect('/roles');
  }
};

export const rolesUpdate = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body;
    const permission_ids = Array.isArray(req.body.permission_ids)
      ? req.body.permission_ids.map(Number)
      : req.body.permission_ids
      ? [Number(req.body.permission_ids)]
      : [];

    if (!name || name.trim() === '') {
      req.flash('error', 'Role name is required');
      return res.redirect(`/roles/edit/${id}`);
    }

    await Role.update(id, { name, description, permission_ids });

    req.flash('success', 'Role updated successfully');
    res.redirect('/roles');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating role');
    res.redirect(`/roles/edit/${req.params.id}`);
  }
}; 

export const rolesDelete = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await Role.delete(id);
    req.flash('success', 'Role deleted');
    res.redirect('/roles');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting role');
    res.redirect('/roles');
  }
};
