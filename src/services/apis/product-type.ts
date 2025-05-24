import API from "@/services/axios";
import { Endpoint } from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";

export const fetchProductTypeList = async () => {
  const { data } = await API.get(Endpoint().productType.list);
  return data;
};

export const fetchProductTypeBySubCategory = async (subCategoryId: string) => {
  const { data } = await API.get(Endpoint().productType.bySubCategory(subCategoryId));
  return data;
};

export interface CreateProductTypeData {
  name: string;
  subCategoryId: string;
  isDeleted?: boolean;
}

export const fetchCreateProductType = async (createProductTypeData: CreateProductTypeData): Promise<BaseResponse<null>> => {
  const { data } = await API.post(Endpoint().productType.create, createProductTypeData);
  return data;
};

export const fetchUpdateProductType = async (id: string, updateProductTypeData: CreateProductTypeData): Promise<BaseResponse<null>> => {
  const { data } = await API.patch(Endpoint().productType.update(id), updateProductTypeData);
  return data;
};

export const fetchDeleteProductType = async (id: string): Promise<BaseResponse<null>> => {
  const { data } = await API.delete(Endpoint().productType.delete(id));
  return data;
};
