import {Request, Response} from "express";
import { Dashboard } from '../models/Dashboard'
import { AssetRequest } from '../models/AssetRequest';
import { AssetTransfer } from '../models/AssetTransfer';
import { Role } from '../models/Role';

const title = 'Dashboard';

export const dashboardIndex = async (req: Request, res: Response) => {
    
    const recentRequests = await AssetRequest.getRecent(5);
    const recentTransfers = await AssetTransfer.getRecent(5);
    const assetCategoryChart = await Dashboard.getAssetCategoryDistribution();
  
    const userRole = await Role.getRoleByUserId((req.session as any).user.id);
    const currentUser = (req.session as any).user;

    const isBasicUser = currentUser.role === 'Employee'; 

    var stats = {};
    if (isBasicUser) {
      stats = await Dashboard.getEmployeeStats(currentUser.employee_id);
    } else {
      stats = await Dashboard.getGeneralStats();
    }
  
    res.render('pages/dashboard/index', {
      title: title,
      stats,
      recentRequests,
      chartData: assetCategoryChart,
      recentTransfers,
      userRole,
      currentUser,
      isBasicUser,
      now: new Date()
    });
  };
