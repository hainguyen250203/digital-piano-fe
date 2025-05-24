import { CreateDiscountData, DiscountData, UpdateDiscountData } from "@/hooks/apis/discount";
import API from "@/services/axios";
import { Endpoint } from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";
export type { CreateDiscountData, UpdateDiscountData };

export enum DiscountType {
  percentage = 'percentage',
  fixed = 'fixed'
}

export const fetchDiscountList = async () => {
  const { data } = await API.get(Endpoint().discount.list);
  return data;
};

export const fetchDiscountById = async (id: string): Promise<BaseResponse<DiscountData>> => {
  const { data } = await API.get(Endpoint().discount.detail(id));
  return data;
};

export const fetchCreateDiscount = async (createDiscountData: CreateDiscountData): Promise<BaseResponse<DiscountData>> => {
  const { data } = await API.post(Endpoint().discount.create, createDiscountData);
  return data;
};

export const fetchUpdateDiscount = async (id: string, updateDiscountData: UpdateDiscountData): Promise<BaseResponse<DiscountData>> => {
  const { data } = await API.patch(Endpoint().discount.update(id), updateDiscountData);
  return data;
};

export const fetchDeleteDiscount = async (id: string): Promise<BaseResponse<null>> => {
  const { data } = await API.delete(Endpoint().discount.delete(id));
  return data;
};

export const fetchValidateDiscount = async (code: string, amount: number): Promise<BaseResponse<{ discountAmount: number }>> => {
  const { data } = await API.post(Endpoint().discount.validate, { code, amount });
  return data;
}; 

export const fetchGetDiscountByCode = async (code: string): Promise<BaseResponse<DiscountData>> => {
  const { data } = await API.get(Endpoint().discount.getByCode(code));
  return data;
};