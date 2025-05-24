import { CategoryMenuData } from "@/hooks/apis/category";
import API from "@/services/axios";
import { Endpoint } from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";

export const fetchCategoryList = async () => {
  const { data } = await API.get(Endpoint().category.list);
  return data;
};

export interface CreateCategoryData {
  name: string;
  isDeleted?: boolean;
}

export const fetchCreateCategory = async (createCategoryData: CreateCategoryData): Promise<BaseResponse<null>> => {
  const { data } = await API.post(Endpoint().category.create, createCategoryData);
  return data;
};

export const fetchUpdateCategory = async (id: string, updateCategoryData: CreateCategoryData): Promise<BaseResponse<null>> => {
  const { data } = await API.patch(Endpoint().category.update(id), updateCategoryData);
  return data;
};

export const fetchDeleteCategory = async (id: string): Promise<BaseResponse<null>> => {
  const { data } = await API.delete(Endpoint().category.delete(id));
  return data;
};

export const fetchCategoryMenu = async (): Promise<BaseResponse<CategoryMenuData[]>> => {
  const { data } = await API.get(Endpoint().category.menu);
  return data;
};
