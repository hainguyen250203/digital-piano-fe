import { QueryKey } from "@/models/QueryKey";
import { FetchGetDashboardStatistics, FetchGetProductStatistics, FetchGetRevenueStatistics, FetchGetSalesStatistics, FetchGetStockStatistics, FetchGetUserStatistics } from "@/services/apis/statistics";
import { ReqProductStatistics, ReqRevenueStatistics, ReqSalesStatistics, ReqStockStatistics, ReqUserStatistics, StockSortType } from "@/types/statistics.type";
import { useQuery } from "@tanstack/react-query";

export const useFetchGetSalesStatistics = (params: ReqSalesStatistics = {}) => {
  return useQuery({
    queryKey: [QueryKey.GET_SALES_STATISTICS, params],
    queryFn: () => FetchGetSalesStatistics(params),
  });
};

export const useFetchGetProductStatistics = (params: ReqProductStatistics = {}) => {
  return useQuery({
    queryKey: [QueryKey.GET_PRODUCT_STATISTICS, params],
    queryFn: () => FetchGetProductStatistics(params),
  });
};

export const useFetchGetUserStatistics = (params: ReqUserStatistics = {}) => {
  return useQuery({
    queryKey: [QueryKey.GET_USER_STATISTICS, params],
    queryFn: () => FetchGetUserStatistics(params),
  });
};

export const useFetchGetRevenueStatistics = (params: ReqRevenueStatistics = {}) => {
  return useQuery({
    queryKey: [QueryKey.GET_REVENUE_STATISTICS, params],
    queryFn: () => FetchGetRevenueStatistics(params),
  });
};

export const useFetchGetStockStatistics = (params: ReqStockStatistics = { sortBy: StockSortType.LOW_STOCK }) => {
  return useQuery({
    queryKey: [QueryKey.GET_STOCK_STATISTICS, params],
    queryFn: () => FetchGetStockStatistics(params),
  });
};

export const useFetchGetDashboardStatistics = (params: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: [QueryKey.GET_DASHBOARD_STATISTICS, params],
    queryFn: () => FetchGetDashboardStatistics(params),
  });
};
