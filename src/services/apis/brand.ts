import { BrandData, CreateBrandData } from "@/hooks/apis/brand";
import API from "@/services/axios";
import { Endpoint } from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";
export type { CreateBrandData };

export const fetchBrandList = async () => {
  const { data } = await API.get(Endpoint().brand.list);
  return data;
};

export const fetchCreateBrand = async (createBrandData: CreateBrandData): Promise<BaseResponse<BrandData>> => {
  const { data } = await API.post(Endpoint().brand.create, createBrandData);
  return data;
};

export const fetchUpdateBrand = async (id: string, updateBrandData: CreateBrandData): Promise<BaseResponse<null>> => {
  const { data } = await API.patch(Endpoint().brand.update(id), updateBrandData);
  return data;
};

export const fetchDeleteBrand = async (id: string): Promise<BaseResponse<null>> => {
  const { data } = await API.delete(Endpoint().brand.delete(id));
  return data;
};