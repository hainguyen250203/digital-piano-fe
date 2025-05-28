// Sales
export interface ResSalesStatistics {
  ordersByStatus: { status: string; count: number }[];
  ordersByPaymentStatus: { status: string; count: number }[];
  ordersByDate: { date: string; count: number }[];
  totalOrders: number;
}

// Common interfaces
export interface OrderStatusItem {
  status: string;
  count: number;
}

// Product
export interface ResProductStatistics {
  bestSellingProducts: {
    product: { id: string; name: string; price: number };
    totalQuantity: number;
    totalRevenue: number;
  }[];
  salesByCategory: {
    categoryId: string;
    categoryName: string;
    totalQuantity: number;
    totalRevenue: number;
  }[];
  salesBySubCategory: {
    subCategoryId: string;
    subCategoryName: string;
    categoryId: string;
    categoryName: string;
    totalQuantity: number;
    totalRevenue: number;
  }[];
  highestRevenueProducts: {
    product: { id: string; name: string; price: number };
    totalQuantity: number;
    totalRevenue: number;
  }[];
}

// User
export interface ResUserStatistics {
  totalNewUsers: number;
  newUsersByDate: { date: string; count: number }[];
  totalActiveUsers: number;
  topCustomersByOrderCount: {
    id: string;
    email: string;
    phoneNumber?: string;
    avatarUrl?: string;
    orderCount: number;
  }[];
  topCustomersBySpending: {
    id: string;
    email: string;
    phoneNumber?: string;
    avatarUrl?: string;
    totalSpending: number;
  }[];
}

// Revenue
export interface ResRevenueStatistics {
  revenueByDate: { 
    date: string; 
    [paymentMethod: string]: string | number;
  }[];
}

// Stock
export interface ResStockStatistics {
  sortBy: StockSortType;
  stockLevels: {
    stockId: string;
    productId: string;
    productName: string;
    quantity: number;
    subCategoryId: string;
    subCategoryName: string;
    categoryId: string;
    categoryName: string;
  }[];
  stockMovement: {
    recentChanges: {
      id: string;
      productId: string;
      productName: string;
      changeType: string;
      change: number;
      createdAt: string;
      referenceType?: string;
      referenceId?: string;
      note?: string;
    }[];
    changeTypeSummary: {
      import: number;
      sale: number;
      return: number;
      cancel: number;
      adjustment: number;
    };
  };
  outOfStockProducts: {
    stockId: string;
    productId: string;
    productName: string;
    quantity: number;
    subCategoryId: string;
    subCategoryName: string;
    categoryId: string;
    categoryName: string;
  }[];
  lowStockProducts: {
    stockId: string;
    productId: string;
    productName: string;
    quantity: number;
    subCategoryId: string;
    subCategoryName: string;
    categoryId: string;
    categoryName: string;
  }[];
  importValueData: {
    totalImportValue: number;
    totalImportQuantity: number;
    totalSalesQuantity: number;
    totalReturnsQuantity: number;
    recentInvoices: {
      id: string;
      supplierId: string;
      supplierName: string;
      totalAmount: number;
      createdAt: Date;
    }[];
    topProductsByImportValue: {
      productId: string;
      productName: string;
      totalImportValue: number;
      totalQuantity: number;
      averageImportPrice: number;
    }[];
  };
  stockSummary: {
    outOfStockCount: number;
    lowStockCount: number;
  };
}

// Dashboard
export interface ResDashboardStatistics {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  monthlyOrders: number;
  monthlyRevenue: number;
  yearlyOrders: number;
  yearlyRevenue: number;
  lowStockProducts: {
    id: string;
    productId: string;
    quantity: number;
    product: {
      id: string;
      name: string;
    };
  }[];
  orderStatusCounts: {
    pending: number;
    processing: number;
    shipping: number;
    delivered: number;
    cancelled: number;
    returned: number;
  };
}

// Time period enum for frontend filtering
export enum TimePeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  CUSTOM = 'custom'
}

// Stock sort type enum
export enum StockSortType {
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  HIGH_STOCK = 'high_stock',
  MOST_CHANGED = 'most_changed'
}

// Request interfaces with minimal parameters (for frontend filtering)
export interface ReqSalesStatistics {
  period?: TimePeriod;
  startDate?: Date;
  endDate?: Date;
}

export interface ReqProductStatistics {
  period?: TimePeriod;
  startDate?: Date;
  endDate?: Date;
}

export interface ReqUserStatistics {
  period?: TimePeriod;
  startDate?: Date;
  endDate?: Date;
}

export interface ReqRevenueStatistics {
  period?: TimePeriod;
  startDate?: Date;
  endDate?: Date;
}

export interface ReqStockStatistics {
  sortBy?: StockSortType;
  startDate?: Date;
  endDate?: Date;
} 