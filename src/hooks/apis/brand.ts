import { QueryKey } from '@/models/QueryKey';
import { fetchBrandList, fetchCreateBrand, fetchDeleteBrand, fetchUpdateBrand } from '@/services/apis/brand';
import { BaseResponse } from '@/types/base-response';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface BrandData {
  id: string;
  name: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandListResponse {
  message: string;
  errorCode: number;
  data: BrandData[];
}

export interface CreateBrandData {
  name: string;
  isDeleted?: boolean;
}

export const useFetchBrandList = () => {
  return useQuery<BrandListResponse, Error>({
    queryKey: [QueryKey.BRAND_LIST],
    queryFn: fetchBrandList,
  });
};

export const useFetchCreateBrand = (options?: {
  onSuccess?: (data: BaseResponse<BrandData>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (body: CreateBrandData) => fetchCreateBrand(body),
    ...options,
  });
};

export const useFetchUpdateBrand = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateBrandData }) => fetchUpdateBrand(id, data),
    onSuccess: (data: BaseResponse<null>) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.BRAND_LIST] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: BaseResponse<null>) => {
      if (options?.onError) {
        options.onError(error);
      }
      return error.message;
    }
  });
};

export const useFetchDeleteBrand = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (id: string) => fetchDeleteBrand(id),
    ...options,
  });
};