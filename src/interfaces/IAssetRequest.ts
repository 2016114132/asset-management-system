export interface IAssetRequest {
    id: number;
    request_type: 'New' | 'Replacement' | 'Repair' | 'Disposal';
    asset_id?: number | null;
    description: string;
    status: 'Pending' | 'Approved' | 'Denied';
    requested_by: number;
    submitted_at?: string;
  }
  