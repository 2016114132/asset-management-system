import db from '../config/db';
import { IDashboardStats, IRequestTypeChart, IAssetCategoryDistribution } from '../interfaces/IDashboard';

export class Dashboard {
  static async getGeneralStats(): Promise<Pick<IDashboardStats, 'assets' | 'pendingRequests' | 'transfers' | 'employees'>> {
    const [assets, pendingRequests, transfers, employees] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM assets`),
      db.query(`SELECT COUNT(*) FROM asset_requests WHERE status = 'Pending'`),
      db.query(`SELECT COUNT(*) FROM asset_transfers`),
      db.query(`SELECT COUNT(*) FROM employees WHERE status = 'Active'`)
    ]);

    return {
      assets: Number(assets.rows[0].count),
      pendingRequests: Number(pendingRequests.rows[0].count),
      transfers: Number(transfers.rows[0].count),
      employees: Number(employees.rows[0].count)
    };
  }

  static async getEmployeeStats(employeeId: number): Promise<Pick<IDashboardStats, 'myAssets' | 'myOpenRequests'>> {
    const [myAssets, myRequests] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM assets WHERE assigned_to = $1`, [employeeId]),
      db.query(`SELECT COUNT(*) FROM asset_requests WHERE requested_by = $1 AND status = 'Pending'`, [employeeId])
    ]);

    return {
      myAssets: Number(myAssets.rows[0].count),
      myOpenRequests: Number(myRequests.rows[0].count)
    };
  }

  static async getRequestTypeDistribution(): Promise<IRequestTypeChart> {
    const result = await db.query(`
      SELECT request_type, COUNT(*) AS total
      FROM asset_requests
      GROUP BY request_type
    `);

    const chartData: IRequestTypeChart = {
      new: 0,
      replacement: 0,
      repair: 0,
      disposal: 0
    };

    result.rows.forEach(r => {
      const key = r.request_type.toLowerCase() as keyof IRequestTypeChart;
      if (chartData[key] !== undefined) {
        chartData[key] = parseInt(r.total);
      }
    });

    return chartData;
  }

  static async getAssetCategoryDistribution(): Promise<IAssetCategoryDistribution> {
    const result = await db.query(`
      SELECT c.name AS category, COUNT(a.id) AS total
      FROM categories c
      JOIN assets a ON a.category_id = c.id
      GROUP BY c.name
      HAVING COUNT(a.id) > 0
      ORDER BY c.name
    `);
  
    const labels: string[] = [];
    const counts: number[] = [];
  
    result.rows.forEach(row => {
      labels.push(row.category);
      counts.push(parseInt(row.total));
    });
  
    return { labels, counts };
  }
  
}
