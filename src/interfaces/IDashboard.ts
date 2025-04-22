export interface IDashboardStats {
    assets: number;
    pendingRequests: number;
    transfers: number;
    employees: number;
    myAssets: number;
    myOpenRequests: number;
  }
  
  export interface IRequestTypeChart {
    new: number;
    replacement: number;
    repair: number;
    disposal: number;
  }
  
  export interface IAssetCategoryDistribution {
    labels: string[];
    counts: number[];
  }