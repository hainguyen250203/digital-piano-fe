import { fetchCreateReview, fetchDeleteReview, fetchUpdateReview } from "@/services/apis/review";
import { BaseResponse } from "@/types/base-response";
import { CreateReviewPayload, DeleteReviewPayload, EditReviewPayload } from "@/types/review.type";
import { useMutation } from "@tanstack/react-query";

export const useFetchCreateReview = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => fetchCreateReview(payload),
    ...options,
  });
};

export const useFetchUpdateReview = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (payload: EditReviewPayload) => fetchUpdateReview(payload),
    ...options,
  });
};

export const useFetchDeleteReview = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (payload: DeleteReviewPayload) => fetchDeleteReview(payload),
    ...options,
  });
};