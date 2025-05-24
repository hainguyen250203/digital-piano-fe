import { QueryKey } from '@/models/QueryKey';
import { CreateProductTypeData, fetchCreateProductType, fetchDeleteProductType, fetchProductTypeBySubCategory, fetchProductTypeList, fetchUpdateProductType } from '@/services/apis/product-type';
import { BaseResponse } from '@/types/base-response';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface ProductTypeData {
  id: string;
  name: string;
  isDeleted: boolean;
  subCategoryId?: string;
  subCategory?: {
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
    }
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductTypeListResponse {
  message: string;
  errorCode: number;
  data: ProductTypeData[];
}

export const useFetchProductTypeList = () => {
  return useQuery<ProductTypeListResponse, Error>({
    queryKey: [QueryKey.PRODUCT_TYPE_LIST],
    queryFn: fetchProductTypeList,
  });
};

export const useFetchProductTypeBySubCategory = (subCategoryId: string) => {
  return useQuery<ProductTypeListResponse, Error>({
    queryKey: [QueryKey.PRODUCT_TYPE_LIST, subCategoryId],
    queryFn: () => fetchProductTypeBySubCategory(subCategoryId),
    enabled: !!subCategoryId,
  });
};

export const useFetchCreateProductType = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (data: CreateProductTypeData) => fetchCreateProductType(data),
    ...options
  });
};

export const useFetchUpdateProductType = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateProductTypeData }) => fetchUpdateProductType(id, data),
    ...options
  });
};

export const useFetchDeleteProductType = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchDeleteProductType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_TYPE_LIST] });
    },
    onError: (error: BaseResponse<null>) => {
      return error.message;
    },
    ...options
  });
};