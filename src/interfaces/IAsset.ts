export interface IAsset {
    id?: number;
    asset_tag: string;
    name: string;
    category_id: number;
    campus_id: number;
    condition: string;
    status: string;
    purchase_date?: string;
    assigned_to?: number | null;
    created_at?: string;
    updated_at?: string;
  }
  