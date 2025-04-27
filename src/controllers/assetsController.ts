import { Request, Response } from 'express';
import { Asset } from '../models/Asset';
import { Category } from '../models/Category';
import { Campus } from '../models/Campus';
import { Employee } from '../models/Employee';

const title = 'Assets';

export const assetsIndex = async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).session.user;
    const isEmployee = currentUser.role === 'Employee';

    const assets = await Asset.getAll(isEmployee ? currentUser.employee_id : undefined);

    res.render('pages/assets/index', { title, assets });
  } catch (err) {
    console.error(err);
    (req as any).flash('error', 'Failed to load assets');
    res.redirect('/');
  }
};

export const assetsCreateForm = async (req: Request, res: Response) => {
  try {
    const categories = await Category.getAll();
    const campuses = await Campus.getAll();
    const employees = await Employee.getAll();
    const nextAssetTag = await Asset.generateNextTag();

    res.render('pages/assets/create', {
      title,
      categories,
      campuses,
      employees,
      nextAssetTag
    });
  } catch (err) {
    console.error(err);
    (req as any).flash('error', 'Error loading form data');
    res.redirect('/assets');
  }
};


export const assetsCreate = async (req: Request, res: Response) => {
  try {
    const {
      asset_tag,
      name,
      category_id,
      campus_id,
      condition,
      status,
      purchase_date,
      assigned_to
    } = req.body;

    if (!asset_tag || !name || !category_id || !campus_id || !condition || !status) {
      (req as any).flash('error', 'All required fields must be filled');
      return res.redirect(req.get('Referrer') || '/assets/create');
    }

    const newAsset = new Asset({
      asset_tag,
      name,
      category_id: Number(category_id),
      campus_id: Number(campus_id),
      condition,
      status,
      purchase_date: purchase_date || null,
      assigned_to: assigned_to || null
    });

    const saved = await newAsset.save();

    if(!saved){
      (req as any).flash('error', 'Unable to create asset');
      return res.redirect(req.get('Referrer') || '/assets/create');
    }   

    (req as any).flash('success', 'Asset created successfully');
    res.redirect('/assets');
  } catch (err) {
    console.error(err);
    (req as any).flash('error', 'Error creating asset');
    res.redirect(req.get('Referrer') || '/assets/create');
  }
};

export const assetsEditForm = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const asset = await Asset.findById(id);

    if (!asset) {
      (req as any).flash('error', 'Asset not found');
      return res.redirect('/assets');
    }

    const categories = await Category.getAll();
    const campuses = await Campus.getAll();
    const employees = await Employee.getAll();

    res.render('pages/assets/edit', {
      title,
      asset,
      categories,
      campuses,
      employees
    });
  } catch (err) {
    console.error(err);
    (req as any).flash('error', 'Error loading asset');
    res.redirect('/assets');
  }
};

export const assetsUpdate = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      asset_tag,
      name,
      category_id,
      campus_id,
      condition,
      status,
      purchase_date,
      assigned_to
    } = req.body;

    if (!asset_tag || !name || !category_id || !campus_id || !condition || !status) {
      (req as any).flash('error', 'All required fields must be filled');
      return res.redirect(req.get('Referrer') || `/assets/edit/${id}`);
    }

    // Create an instance of the asset
    const asset = new Asset({
      id,
      asset_tag,
      name,
      category_id,
      campus_id,
      condition,
      status,
      purchase_date,
      assigned_to
    });

    const saved = await asset.save();

    if(!saved){
      (req as any).flash('error', 'Unable to save asset');
      return res.redirect(req.get('Referrer') || `/assets/edit/${id}`);
    }        

    (req as any).flash('success', 'Asset updated successfully');
    res.redirect('/assets');
  } catch (err) {
    console.error(err);
    (req as any).flash('error', 'Error updating asset');
    res.redirect(req.get('Referrer') || `/assets/edit/${req.params.id}`);
  }
};

export const assetsDelete = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await Asset.delete(id);
    (req as any).flash('success', 'Asset deleted successfully');
    res.redirect('/assets');
  } catch (err) {
    console.error(err);
    (req as any).flash('error', 'Error deleting asset');
    res.redirect('/assets');
  }
};

export const assetsView = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const asset = await Asset.findById(id);

    if (!asset) {
      (req as any).flash('error', 'Asset not found');
      return res.redirect('/assets');
    }

    const category = await Category.findById(asset.category_id);
    const campus = await Campus.findById(asset.campus_id);
    const employee = asset.assigned_to ? await Employee.findById(asset.assigned_to) : null;

    res.render('pages/assets/view', {
      title: 'View Asset',
      asset,
      category,
      campus,
      employee
    });
  } catch (err) {
    console.error(err);
    (req as any).flash('error', 'Error loading asset');
    res.redirect('/assets');
  }
};

