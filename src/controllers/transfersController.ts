import { Request, Response } from 'express';
import { AssetTransfer } from '../models/AssetTransfer';
import { Asset } from '../models/Asset';
import { Campus } from '../models/Campus';
import { Employee } from '../models/Employee';

const title = 'Transfers';

export const transfersIndex = async (req: Request, res: Response) => {
  try {
    const transfers = await AssetTransfer.getAll();
    res.render('pages/transfers/index', { title, transfers });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading transfers');
    res.redirect('/');
  }
};

export const transfersView = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const transfer = await AssetTransfer.findById(id);
    if (!transfer) {
      req.flash('error', 'Transfer not found');
      return res.redirect('/transfers');
    }

    const asset = await Asset.findById(transfer.asset_id);
    const fromCampus = await Campus.findById(transfer.from_campus_id);
    const toCampus = await Campus.findById(transfer.to_campus_id);
    const fromEmployee = transfer.from_employee_id ? await Employee.findById(transfer.from_employee_id) : null;
    const toEmployee = transfer.to_employee_id ? await Employee.findById(transfer.to_employee_id) : null;
    const byUser = await Employee.findById(transfer.transferred_by);

    res.render('pages/transfers/view', {
      title: 'View Transfer',
      transfer,
      asset,
      fromCampus,
      toCampus,
      fromEmployee,
      toEmployee,
      byUser
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading transfer');
    res.redirect('/transfers');
  }
};


export const transfersCreateForm = async (req: Request, res: Response) => {
  try {
    const assets = await Asset.getAll();
    const campuses = await Campus.getAll();
    const employees = await Employee.getAll();
    const currentUser = (req.session as any).user;

    res.render('pages/transfers/create', {
      title,
      assets,
      campuses,
      employees,
      currentUser
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading form');
    res.redirect('/transfers');
  }
};

export const transfersCreate = async (req: Request, res: Response) => {
  try {
    const {
      asset_id,
      from_campus_id,
      to_campus_id,
      from_employee_id,
      to_employee_id,
      reason
    } = req.body;

    if (!asset_id || !from_campus_id || !to_campus_id || !reason) {
      req.flash('error', 'Please fill in all required fields');
      return res.redirect(req.get('Referrer') || '/transfers/create');
    }

    await AssetTransfer.create({
      asset_id: Number(asset_id),
      from_campus_id: Number(from_campus_id),
      to_campus_id: Number(to_campus_id),
      from_employee_id: from_employee_id || null,
      to_employee_id: to_employee_id || null,
      reason,
      transferred_by: (req.session as any).user.id
    });

    req.flash('success', 'Transfer recorded successfully');
    res.redirect('/transfers');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error recording transfer');
    res.redirect(req.get('Referrer') || '/transfers/create');
  }
};

export const transfersDelete = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await AssetTransfer.delete(id);
    req.flash('success', 'Transfer deleted');
    res.redirect('/transfers');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting transfer');
    res.redirect('/transfers');
  }
};

export const transfersUpdateStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!['Transferred', 'Rejected'].includes(status)) {
      req.flash('error', 'Invalid status');
      return res.redirect('/transfers');
    }

    const transfer = await AssetTransfer.findById(id);
    if (!transfer) {
      req.flash('error', 'Transfer not found');
      return res.redirect('/transfers');
    }

    await AssetTransfer.updateStatus(id, status);

    if (status === 'Transferred') {
      await Asset.updateTransferDetails(
        transfer.asset_id,
        transfer.to_campus_id,
        transfer.to_employee_id ?? null
      );
    }

    req.flash('success', `Transfer marked as ${status.toLowerCase()}`);
    res.redirect('/transfers');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating transfer status');
    res.redirect('/transfers');
  }
};


export const getAssetDetails = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const asset = await Asset.findById(id);

    if (!asset){
      res.status(404).json({ error: 'Asset not found' });
      return;
    }

    res.json({
      campus_id: asset.campus_id,
      assigned_to: asset.assigned_to
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching asset details' });
  }
};

