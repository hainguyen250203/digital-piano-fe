import { QueryKey } from '@/models/QueryKey';
import { CreateCategoryData, fetchCategoryList, fetchCreateCategory, fetchDeleteCategory, fetchUpdateCategory, fetchCategoryMenu } from '@/services/apis/category';
import { BaseResponse } from '@/types/base-response';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface CategoryData {
  id: string;
  name: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryListResponse {
  message: string;
  errorCode: number;
  data: CategoryData[];
}


export interface CategoryMenuData {
  id: string;
  name: string;
  subCategories: SubCategoryMenuData[];
}

export interface SubCategoryMenuData {
  id: string;
  name: string;
  productTypes: ProductTypeMenuData[];
}

export interface ProductTypeMenuData {
  id: string;
  name: string;
}

export const useFetchCategoryList = () => {
  return useQuery<CategoryListResponse, Error>({
    queryKey: [QueryKey.CATEGORY_LIST],
    queryFn: fetchCategoryList,
  });
};

export const useFetchCreateCategory = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (data: CreateCategoryData) => fetchCreateCategory(data),
    ...options
  });
};

export const useFetchUpdateCategory = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCategoryData }) => fetchUpdateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.CATEGORY_LIST] });
    },
    onError: (error: BaseResponse<null>) => {
      return error.message;
    },
    ...options
  });
};

export const useFetchDeleteCategory = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (id: string) => fetchDeleteCategory(id),
    ...options
  });
};

export const useFetchCategoryMenu = (options?: {
  onSuccess?: (data: BaseResponse<CategoryMenuData[]>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useQuery<BaseResponse<CategoryMenuData[]>, Error>({
    queryKey: [QueryKey.CATEGORY_MENU],
    queryFn: () => fetchCategoryMenu(),
    ...options
  });
};
