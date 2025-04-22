import { Request, Response } from 'express';
import { Campus } from '../models/Campus';

const title = 'Campuses';

export const campusesIndex = async (req: Request, res: Response) => {
  try {
    const campuses = await Campus.getAll();
    res.render('pages/campuses/index', { title, campuses });
  } catch (err) {
    console.error(err);
    (req as any).flash('error', 'Failed to load campuses');
    res.redirect('/');
  }
};

export const campusesCreateForm = (req: Request, res: Response) => {
  res.render('pages/campuses/create', { title });
};

export const campusesCreate = async (req: Request, res: Response) => {
  try {
    const { name, location } = req.body;

    if (!name || name.trim() === '') {
      (req as any).flash('error', 'Name is required');
      return res.redirect(req.get('Referrer') || '/campuses/create');
    }

    await Campus.create({ name, location });
    (req as any).flash('success', 'Campus created successfully');
    res.redirect('/campuses');
  } catch (err) {
    console.error(err);
    (req as any).flash('error', 'Error creating campus');
    res.redirect(req.get('Referrer') || '/campuses/create');
  }
};

export const campusesEditForm = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const campus = await Campus.findById(id);
    if (!campus) {
      (req as any).flash('error', 'Campus not found');
      return res.redirect('/campuses');
    }

    res.render('pages/campuses/edit', { title, campus });
  } catch (err) {
    console.error(err);
    (req as any).flash('error', 'Error loading campus');
    res.redirect('/campuses');
  }
};

export const campusesUpdate = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, location } = req.body;

    if (!name || name.trim() === '') {
      (req as any).flash('error', 'Name is required');
      return res.redirect(req.get('Referrer') || `/campuses/edit/${id}`);
    }

    await Campus.update(id, { name, location });
    (req as any).flash('success', 'Campus updated successfully');
    res.redirect('/campuses');
  } catch (err) {
    console.error(err);
    (req as any).flash('error', 'Error updating campus');
    res.redirect(req.get('Referrer') || `/campuses/edit/${req.params.id}`);
  }
};

export const campusesDelete = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await Campus.delete(id);
    (req as any).flash('success', 'Campus deleted successfully');
    res.redirect('/campuses');
  } catch (err) {
    console.error(err);
    (req as any).flash('error', 'Error deleting campus');
    res.redirect('/campuses');
  }
};
