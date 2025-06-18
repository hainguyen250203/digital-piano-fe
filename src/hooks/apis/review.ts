import { QueryKey } from "@/models/QueryKey";
import { fetchAdminDeleteReview, fetchAdminUpdateReview, fetchCreateReview, fetchDeleteReview, fetchUpdateReview } from "@/services/apis/review";
import { BaseResponse } from "@/types/base-response";
import { ResponseOrder } from "@/types/order.type";
import { ProductDetailData } from "@/types/product.type";
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

      // Cập nhật cache PRODUCT_DETAIL thay vì invalidate
      queryClient.setQueryData<BaseResponse<ProductDetailData>>(
        [QueryKey.PRODUCT_DETAIL, data.data.productId],
        (old) => {
          if (!old?.data) return old;
          const newData = {
            ...old,
            data: {
              ...old.data,
              reviews: [...old.data.reviews, { ...data.data, user: old.data.reviews[0]?.user || { id: '', email: '', avatarUrl: null } }]
            }
          };
          return newData;
        }
      );

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

      // Cập nhật cache PRODUCT_DETAIL thay vì invalidate
      queryClient.setQueryData<BaseResponse<ProductDetailData>>(
        [QueryKey.PRODUCT_DETAIL, data.data.productId],
        (old) => {
          if (!old?.data) return old;
          const newData = {
            ...old,
            data: {
              ...old.data,
              reviews: old.data.reviews.map((review) =>
                review.id === data.data.id ? { ...data.data, user: review.user } : review
              )
            }
          };
          return newData;
        }
      );

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

      options?.onSuccess?.(data);
    },
    onError: (error: BaseResponse<null>) => {
      console.error('Delete Review Error:', error);
      options?.onError?.(error);
    }
  });
};

// Admin hooks for managing reviews
export const useFetchUpdateReviewAdmin = (productId: string, options?: {
  onSuccess?: (data: BaseResponse<ResponeReviewType>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EditReviewPayload) => fetchAdminUpdateReview(payload),
    onSuccess: (data) => {
      console.log('Admin Update Review Success:', { data, productId });

      // Cập nhật cache PRODUCT_DETAIL một cách an toàn
      queryClient.setQueryData<BaseResponse<ProductDetailData>>(
        [QueryKey.PRODUCT_DETAIL, productId],
        (old) => {
          if (!old?.data) return old;

          // Kiểm tra xem review có thực sự thay đổi không
          const existingReview = old.data.reviews.find(review => review.id === data.data.id);
          if (existingReview &&
            existingReview.rating === data.data.rating &&
            existingReview.content === data.data.content) {
            return old; // Không thay đổi gì nếu dữ liệu giống nhau
          }

          const newData = {
            ...old,
            data: {
              ...old.data,
              reviews: old.data.reviews.map((review) =>
                review.id === data.data.id ? { ...data.data, user: review.user } : review
              )
            }
          };
          return newData;
        }
      );

      // Gọi callback sau khi cập nhật cache
      setTimeout(() => {
        options?.onSuccess?.(data);
      }, 0);
    },
    onError: (error: BaseResponse<null>) => {
      console.error('Admin Update Review Error:', error);
      options?.onError?.(error);
    }
  });
};

export const useFetchDeleteReviewAdmin = (productId: string, options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeleteReviewPayload) => fetchAdminDeleteReview(payload),
    onSuccess: (data, variables) => {
      console.log('Admin Delete Review Success:', { data, variables, productId });

      // Cập nhật cache PRODUCT_DETAIL một cách an toàn
      queryClient.setQueryData<BaseResponse<ProductDetailData>>(
        [QueryKey.PRODUCT_DETAIL, productId],
        (old) => {
          if (!old?.data) return old;

          // Kiểm tra xem review có tồn tại không
          const reviewExists = old.data.reviews.some(review => review.id === variables.id);
          if (!reviewExists) {
            return old; // Không thay đổi gì nếu review không tồn tại
          }

          const newData = {
            ...old,
            data: {
              ...old.data,
              reviews: old.data.reviews.filter((review) => review.id !== variables.id)
            }
          };
          return newData;
        }
      );

      // Gọi callback sau khi cập nhật cache
      setTimeout(() => {
        options?.onSuccess?.(data);
      }, 0);
    },
    onError: (error: BaseResponse<null>) => {
      console.error('Admin Delete Review Error:', error);
      options?.onError?.(error);
    }
  });
};