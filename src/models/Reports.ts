import db from '../config/db';
import { IReportFilter } from '../interfaces/IReport';

export class Reports {
  static async generate(type: string, from?: string, to?: string): Promise<any[]> {
    switch (type) {
      case 'all-assets': {
        const rangeClause = from && to ? `AND a.created_at::date BETWEEN '${from}'::date AND '${to}'::date` : '';
        return await db.query(`
          SELECT a.asset_tag, a.name, a.condition, a.status
          FROM assets a
          WHERE 1=1 ${rangeClause}
        `).then(r => r.rows);
      }

      case 'assigned-assets': {
        const rangeClause = from && to ? `AND a.created_at::date BETWEEN '${from}'::date AND '${to}'::date` : '';
        return await db.query(`
          SELECT a.asset_tag, a.name, e.first_name || ' ' || e.last_name AS assigned_to
          FROM assets a
          JOIN employees e ON a.assigned_to = e.id
          WHERE 1=1 ${rangeClause}
        `).then(r => r.rows);
      }

      case 'transfers': {
        const rangeClause = from && to ? `AND t.transferred_at::date BETWEEN '${from}'::date AND '${to}'::date` : '';
        return await db.query(`
          SELECT a.asset_tag, t.reason, t.status, t.transferred_at
          FROM asset_transfers t
          JOIN assets a ON t.asset_id = a.id
          WHERE 1=1 ${rangeClause}
        `).then(r => r.rows);
      }

      case 'requests': {
        const rangeClause = from && to ? `AND r.submitted_at::date BETWEEN '${from}'::date AND '${to}'::date` : '';
        return await db.query(`
          SELECT request_type, status, submitted_at
          FROM asset_requests r
          WHERE 1=1 ${rangeClause}
        `).then(r => r.rows);
      }

      case 'disposals': {
        const rangeClause = from && to ? `AND a.created_at::date BETWEEN '${from}'::date AND '${to}'::date` : '';
        return await db.query(`
          SELECT a.asset_tag, a.name, a.condition
          FROM assets a
          WHERE a.status = 'Disposed' ${rangeClause}
        `).then(r => r.rows);
      }

      case 'summary':
        return await db.query(`
          SELECT
            (SELECT COUNT(*) FROM assets) AS total_assets,
            (SELECT COUNT(*) FROM assets WHERE assigned_to IS NOT NULL) AS assigned_assets,
            (SELECT COUNT(*) FROM asset_requests) AS total_requests,
            (SELECT COUNT(*) FROM asset_transfers) AS total_transfers
        `).then(r => r.rows);

      default:
        return [];
    }
  }
}
