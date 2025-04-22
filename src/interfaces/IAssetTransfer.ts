export interface IAssetTransfer {
  id: number;
  asset_id: number;
  from_campus_id: number;
  to_campus_id: number;
  from_employee_id?: number | null;
  to_employee_id?: number | null;
  reason: string;
  transferred_by: number;
  transferred_at?: string;
  status?: 'Transferred' | 'Pending' | 'Rejected';
}
