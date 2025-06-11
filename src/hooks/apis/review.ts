import { QueryKey } from "@/models/QueryKey";
import { fetchCreateReview, fetchDeleteReview, fetchUpdateReview } from "@/services/apis/review";
import { BaseResponse } from "@/types/base-response";
import { ResponseOrder } from "@/types/order.type";
import { CreateReviewPayload, DeleteReviewPayload, EditReviewPayload, ResponeReviewType } from "@/types/review.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFetchCreateReview = (orderId: string, options?: {
  onSuccess?: (data: BaseResponse<ResponeReviewType>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => fetchCreateReview(payload),
    onSuccess: (data) => {
      console.log('Create Review Success:', { data, orderId });
      console.log('Current ORDER_DETAIL cache:', queryClient.getQueryData([QueryKey.ORDER_DETAIL, orderId]));

      // Cập nhật cache ORDER_DETAIL
      queryClient.setQueryData<BaseResponse<ResponseOrder>>(
        [QueryKey.ORDER_DETAIL, orderId],
        (old) => {
          console.log('Old cache data:', old);
          if (!old?.data) return old;
          const newData = {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map(item => {
                if (item.productId === data.data.productId) {
                  console.log('Updating item:', item.productId);
                  return {
                    ...item,
                    product: {
                      ...item.product,
                      reviews: [data.data]
                    }
                  };
                }
                return item;
              })
            }
          };
          console.log('New cache data:', newData);
          return newData;
        }
      );

      console.log('Updated ORDER_DETAIL cache:', queryClient.getQueryData([QueryKey.ORDER_DETAIL, orderId]));

      // Invalidate product detail cache để fetch lại reviews mới
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_DETAIL, data.data.productId] });
      options?.onSuccess?.(data);
    },
    onError: (error: BaseResponse<null>) => {
      console.error('Create Review Error:', error);
      options?.onError?.(error);
    }
  });
};

export const useFetchUpdateReview = (orderId: string, options?: {
  onSuccess?: (data: BaseResponse<ResponeReviewType>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EditReviewPayload) => fetchUpdateReview(payload),
    onSuccess: (data) => {
      console.log('Update Review Success:', { data, orderId });
      console.log('Current ORDER_DETAIL cache:', queryClient.getQueryData([QueryKey.ORDER_DETAIL, orderId]));

      // Cập nhật cache ORDER_DETAIL
      queryClient.setQueryData<BaseResponse<ResponseOrder>>(
        [QueryKey.ORDER_DETAIL, orderId],
        (old) => {
          console.log('Old cache data:', old);
          if (!old?.data) return old;
          const newData = {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map(item => {
                if (item.productId === data.data.productId) {
                  console.log('Updating item:', item.productId);
                  return {
                    ...item,
                    product: {
                      ...item.product,
                      reviews: [data.data]
                    }
                  };
                }
                return item;
              })
            }
          };
          console.log('New cache data:', newData);
          return newData;
        }
      );

      console.log('Updated ORDER_DETAIL cache:', queryClient.getQueryData([QueryKey.ORDER_DETAIL, orderId]));

      // Invalidate product detail cache để fetch lại reviews mới
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_DETAIL, data.data.productId] });
      options?.onSuccess?.(data);
    },
    onError: (error: BaseResponse<null>) => {
      console.error('Update Review Error:', error);
      options?.onError?.(error);
    }
  });
};

export const useFetchDeleteReview = (orderId: string, options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeleteReviewPayload) => fetchDeleteReview(payload),
    onSuccess: (data, variables) => {
      console.log('Delete Review Success:', { data, variables, orderId });
      console.log('Current ORDER_DETAIL cache:', queryClient.getQueryData([QueryKey.ORDER_DETAIL, orderId]));

      // Cập nhật cache ORDER_DETAIL
      queryClient.setQueryData<BaseResponse<ResponseOrder>>(
        [QueryKey.ORDER_DETAIL, orderId],
        (old) => {
          console.log('Old cache data:', old);
          if (!old?.data) return old;
          const newData = {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map(item => {
                if (item.product.reviews?.some(review => review.id === variables.id)) {
                  console.log('Updating item:', item.productId);
                  return {
                    ...item,
                    product: {
                      ...item.product,
                      reviews: []
                    }
                  };
                }
                return item;
              })
            }
          };
          console.log('New cache data:', newData);
          return newData;
        }
      );

      console.log('Updated ORDER_DETAIL cache:', queryClient.getQueryData([QueryKey.ORDER_DETAIL, orderId]));

      // Invalidate product detail cache để fetch lại reviews mới
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_DETAIL] });
      options?.onSuccess?.(data);
    },
    onError: (error: BaseResponse<null>) => {
      console.error('Delete Review Error:', error);
      options?.onError?.(error);
    }
  });
};