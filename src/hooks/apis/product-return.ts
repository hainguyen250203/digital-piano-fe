import { QueryKey } from "@/models/QueryKey";
import {
  fetchCancelProductReturn,
  fetchCreateProductReturn,
  fetchGetAllProductReturns,
  fetchGetUserProductReturns,
  fetchUpdateProductReturnStatus,
} from "@/services/apis/product-return";
import { BaseResponse } from "@/types/base-response";
import {
  CreateProductReturnDto,
  ResProductReturn,
  UpdateProductReturnStatusDto,
} from "@/types/return.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchCreateProductReturn = (orderId: string, options?: {
  onSuccess?: (data: BaseResponse<ResProductReturn>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductReturnDto) => fetchCreateProductReturn(orderId, payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.USER_PRODUCT_RETURNS] });
    },
    onSuccess: async (data) => {
      const currentReturns = queryClient.getQueryData<BaseResponse<ResProductReturn[]>>([QueryKey.USER_PRODUCT_RETURNS]);
      if (!currentReturns?.data) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.USER_PRODUCT_RETURNS] });
        options?.onSuccess?.(data);
        return;
      }
      queryClient.setQueryData([QueryKey.USER_PRODUCT_RETURNS], {
        ...currentReturns,
        data: [data.data, ...currentReturns.data],
      });
      options?.onSuccess?.(data);
    },
    ...options,
  });
};

export const useFetchGetUserProductReturns = (options?: {
  onSuccess?: (data: BaseResponse<ResProductReturn[]>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useQuery({
    queryKey: [QueryKey.USER_PRODUCT_RETURNS],
    queryFn: () => fetchGetUserProductReturns(),
    ...options,
  });
};

export const useFetchGetAllProductReturns = (options?: {
  onSuccess?: (data: BaseResponse<ResProductReturn[]>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useQuery({
    queryKey: [QueryKey.ALL_PRODUCT_RETURNS],
    queryFn: () => fetchGetAllProductReturns(),
    ...options,
  });
};

export const useFetchUpdateProductReturnStatus = (options?: {
  onSuccess?: (data: BaseResponse<ResProductReturn>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ returnId, payload }: { returnId: string; payload: UpdateProductReturnStatusDto }) =>
      fetchUpdateProductReturnStatus(returnId, payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.USER_PRODUCT_RETURNS] });
    },
    onSuccess: async (data) => {
      const currentReturns = queryClient.getQueryData<BaseResponse<ResProductReturn[]>>([QueryKey.USER_PRODUCT_RETURNS]);
      if (!currentReturns?.data) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.USER_PRODUCT_RETURNS] });
        options?.onSuccess?.(data);
        return;
      }
      queryClient.setQueryData([QueryKey.USER_PRODUCT_RETURNS], {
        ...currentReturns,
        data: currentReturns.data.map(item => item.id === data.data.id ? data.data : item),
      });
      options?.onSuccess?.(data);
    },
    ...options?.onError,
  });
};

export const useFetchCancelProductReturn = (options?: {
  onSuccess?: (data: BaseResponse<ResProductReturn>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (returnId: string) => fetchCancelProductReturn(returnId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.USER_PRODUCT_RETURNS] });
    },
    onSuccess: async (data) => {
      const currentReturns = queryClient.getQueryData<BaseResponse<ResProductReturn[]>>([QueryKey.USER_PRODUCT_RETURNS]);
      if (!currentReturns?.data) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.USER_PRODUCT_RETURNS] });
        options?.onSuccess?.(data);
        return;
      }
      queryClient.setQueryData([QueryKey.USER_PRODUCT_RETURNS], {
        ...currentReturns,
        data: currentReturns.data.map(item => item.id === data.data.id ? data.data : item),
      });
      options?.onSuccess?.(data);
    },
    ...options,
  });
}; 