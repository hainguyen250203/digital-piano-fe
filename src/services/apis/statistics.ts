import API from "@/services/axios";
import Endpoint from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";
import {
  ReqProductStatistics,
  ReqRevenueStatistics,
  ReqSalesStatistics,
  ReqStockStatistics,
  ReqUserStatistics,
  ResDashboardStatistics,
  ResProductStatistics,
  ResRevenueStatistics,
  ResSalesStatistics,
  ResStockStatistics,
  ResUserStatistics
} from "@/types/statistics.type";

// Helper function for GET with query params
const fetchWithQueryParams = async <TRequest, TResponse>(
  url: string,
  params: TRequest
): Promise<BaseResponse<TResponse>> => {
  const response = await API.get<BaseResponse<TResponse>>(url, { params });
  return response.data;
};

export const FetchGetSalesStatistics = (params: ReqSalesStatistics) =>
  fetchWithQueryParams<ReqSalesStatistics, ResSalesStatistics>(Endpoint().statistics.sales, params);

export const FetchGetProductStatistics = (params: ReqProductStatistics) =>
  fetchWithQueryParams<ReqProductStatistics, ResProductStatistics>(Endpoint().statistics.products, params);

export const FetchGetUserStatistics = (params: ReqUserStatistics) =>
  fetchWithQueryParams<ReqUserStatistics, ResUserStatistics>(Endpoint().statistics.users, params);

export const FetchGetRevenueStatistics = (params: ReqRevenueStatistics) =>
  fetchWithQueryParams<ReqRevenueStatistics, ResRevenueStatistics>(Endpoint().statistics.revenue, params);

export const FetchGetStockStatistics = (params: ReqStockStatistics) =>
  fetchWithQueryParams<ReqStockStatistics, ResStockStatistics>(Endpoint().statistics.stock, params);

export const FetchGetDashboardStatistics = (params: Record<string, unknown> = {}) =>
  fetchWithQueryParams<Record<string, unknown>, ResDashboardStatistics>(Endpoint().statistics.dashboard, params);
