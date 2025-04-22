import { Request, Response } from 'express';
import { AssetRequest } from '../models/AssetRequest';
import { Asset } from '../models/Asset';
import { Employee } from '../models/Employee';
import { sendRequestSubmissionEmail, sendRequestStatusUpdateEmail } from '../utils/mailer';

const title = 'Asset Requests';

export const requestsIndex = async (req: Request, res: Response) => {
  try {
    const currentUser = (req.session as any).user;
    const isEmployee = currentUser.role === 'Employee';

    const requests = await AssetRequest.getAll(isEmployee ? currentUser.employee_id : undefined);

    res.render('pages/requests/index', { title: 'Asset Requests', requests });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading requests');
    res.redirect('/');
  }
};


export const requestsView = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const request = await AssetRequest.findById(id);
    if (!request) {
      req.flash('error', 'Request not found');
      return res.redirect('/requests');
    }

    const asset = request.asset_id ? await Asset.findById(request.asset_id) : null;
    const employee = await Employee.findById(request.requested_by);

    res.render('pages/requests/view', {
      title: 'View Request',
      request,
      asset,
      employee
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading request');
    res.redirect('/requests');
  }
};

export const requestsCreateForm = async (req: Request, res: Response) => {
  try {
    const currentUser = (req.session as any).user;

    // Only fetch assets assigned to this user
    const allAssets = await Asset.getAll();
    const myAssets = allAssets.filter(a => a.assigned_to === currentUser.id);

    // res.send(myAssets);return;

    res.render('pages/requests/create', {
      title,
      assets: myAssets, 
      currentUser
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading form');
    res.redirect('/requests');
  }
};


export const requestsCreate = async (req: Request, res: Response) => {
  try {
    const { request_type, asset_id, description, requested_by } = req.body;

    if (!request_type || !description || !requested_by) {
      req.flash('error', 'Required fields missing');
      return res.redirect(req.get('Referrer') || '/requests/create');
    }

    const requiresAsset = ['Replacement', 'Repair', 'Disposal'].includes(request_type);
    const asset = requiresAsset ? Number(asset_id) : null;

    await AssetRequest.create({
      request_type,
      asset_id: asset,
      description,
      requested_by: Number(requested_by),
      status: 'Pending'
    });

    // Email Confirmation to Employee
    const employee = await Employee.findById(Number(requested_by));
    if (employee && employee.email) {
      await sendRequestSubmissionEmail(employee.email, employee.first_name, request_type, description);
    }

    req.flash('success', 'Request submitted successfully');
    res.redirect('/requests');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error submitting request');
    res.redirect(req.get('Referrer') || '/requests/create');
  }
};

export const requestsDelete = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await AssetRequest.delete(id);
    req.flash('success', 'Request deleted');
    res.redirect('/requests');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting request');
    res.redirect('/requests');
  }
};

export const requestsUpdateStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!['Approved', 'Denied'].includes(status)) {
      req.flash('error', 'Invalid status');
      return res.redirect('/requests');
    }

    const request = await AssetRequest.findById(id);
    if (!request) {
      req.flash('error', 'Request not found');
      return res.redirect('/requests');
    }

    await AssetRequest.update(id, { ...request, status });

    // Update asset status if applicable
    if (status === 'Approved' && request.asset_id) {
      let newAssetStatus: string | null = null;

      switch (request.request_type) {
        case 'Repair':
          newAssetStatus = 'Under Repair';
          break;
        case 'Replacement':
          newAssetStatus = 'Replaced';
          break;
        case 'Disposal':
          newAssetStatus = 'Disposed';
          break;
      }

      if (newAssetStatus) {
        await Asset.updateStatus(request.asset_id, newAssetStatus);
      }
    }

    // Email to Employee about the outcome
    const employee = await Employee.findById(request.requested_by);
    if (employee && employee.email) {
      await sendRequestStatusUpdateEmail(
        employee.email,
        employee.first_name,
        status,
        request.request_type,
        request.description
      );
    }

    req.flash('success', `Request ${status.toLowerCase()} successfully`);
    res.redirect('/requests');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update status');
    res.redirect('/requests');
  }
};


