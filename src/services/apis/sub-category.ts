import API from "@/services/axios";
import { Endpoint } from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";

export const fetchSubCategoryList = async () => {
  const { data } = await API.get(Endpoint().subCategory.list);
  return data;
};

export const fetchSubCategoryByCategory = async (categoryId: string) => {
  if (!categoryId) {
    return { data: [] };
  }
  const { data } = await API.get(`${Endpoint().subCategory.byCategory(categoryId)}`);
  return data;
};

export interface CreateSubCategoryData {
  name: string;
  categoryId: string;
  isDeleted?: boolean;
}

export const fetchCreateSubCategory = async (createSubCategoryData: CreateSubCategoryData): Promise<BaseResponse<null>> => {
  const { data } = await API.post(Endpoint().subCategory.create, createSubCategoryData);
  return data;
};

export const fetchUpdateSubCategory = async (id: string, updateSubCategoryData: CreateSubCategoryData): Promise<BaseResponse<null>> => {
  const { data } = await API.patch(Endpoint().subCategory.update(id), updateSubCategoryData);
  return data;
};

export const fetchDeleteSubCategory = async (id: string): Promise<BaseResponse<null>> => {
  const { data } = await API.delete(Endpoint().subCategory.delete(id));
  return data;
};
