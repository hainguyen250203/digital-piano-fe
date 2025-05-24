import { CategoryData } from '@/hooks/apis/category';
import { QueryKey } from '@/models/QueryKey';
import { CreateSubCategoryData, fetchCreateSubCategory, fetchDeleteSubCategory, fetchSubCategoryByCategory, fetchSubCategoryList, fetchUpdateSubCategory } from '@/services/apis/sub-category';
import { BaseResponse } from '@/types/base-response';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface SubCategoryData {
  id: string;
  name: string;
  isDeleted: boolean;
  category?: CategoryData;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategoryListResponse {
  message: string;
  errorCode: number;
  data: SubCategoryData[];
}

export const useFetchSubCategoryList = () => {
  return useQuery<SubCategoryListResponse, Error>({
    queryKey: [QueryKey.SUB_CATEGORY_LIST],
    queryFn: fetchSubCategoryList,
  });
};

export const useFetchSubCategoryByCategory = (categoryId: string) => {
  return useQuery<SubCategoryListResponse, Error>({
    queryKey: [QueryKey.SUB_CATEGORY_LIST, categoryId],
    queryFn: () => fetchSubCategoryByCategory(categoryId),
    enabled: !!categoryId
  });
};

export const useFetchCreateSubCategory = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (data: CreateSubCategoryData) => fetchCreateSubCategory(data),
    ...options
  });
};

export const useFetchUpdateSubCategory = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateSubCategoryData }) => fetchUpdateSubCategory(id, data),
    ...options
  });
};

export const useFetchDeleteSubCategory = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (id: string) => fetchDeleteSubCategory(id),
    ...options
  });
};