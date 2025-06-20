import API from "@/services/axios";
import Endpoint from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";
import { CreateProductReturnDto, ResProductReturn, UpdateProductReturnStatusDto } from "@/types/return.interface";

export const fetchCreateProductReturn = async (orderId: string, payload: CreateProductReturnDto): Promise<BaseResponse<ResProductReturn>> => {
  const { data } = await API.post(Endpoint().productReturn.create(orderId), payload);
  return data;
};

export const fetchGetUserProductReturns = async (): Promise<BaseResponse<ResProductReturn[]>> => {
  const { data } = await API.get(Endpoint().productReturn.getUserReturns);
  return data;
};

export const fetchGetAllProductReturns = async (): Promise<BaseResponse<ResProductReturn[]>> => {
  const { data } = await API.get(Endpoint().productReturn.getAllReturns);
  return data;
};

export const fetchUpdateProductReturnStatus = async (returnId: string, payload: UpdateProductReturnStatusDto): Promise<BaseResponse<ResProductReturn>> => {
  const { data } = await API.patch(Endpoint().productReturn.updateStatus(returnId), payload);
  return data;
};

export const fetchCancelProductReturn = async (returnId: string): Promise<BaseResponse<ResProductReturn>> => {
  const { data } = await API.patch(Endpoint().productReturn.cancel(returnId));
  return data;
}; 