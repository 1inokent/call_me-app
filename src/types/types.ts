export interface APIResult {
    result: DataItem[]; 
    [key: string]: any; 
  }
  
  export interface DataItem {
    result: Item[];
    [key: string]: any;
  }

  export interface Item {
        id: number | string;
        name: string;
        phone?: string;
  }