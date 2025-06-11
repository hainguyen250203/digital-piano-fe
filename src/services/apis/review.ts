import API from "@/services/axios";
import Endpoint from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";
import { CreateReviewPayload, DeleteReviewPayload, EditReviewPayload, ResponeReviewType } from "@/types/review.type";

export const fetchCreateReview = async (payload: CreateReviewPayload): Promise<BaseResponse<ResponeReviewType>> => {
  const response = await API.post(Endpoint().review.create, payload);
  return response.data;
};

export const fetchUpdateReview = async (payload: EditReviewPayload): Promise<BaseResponse<ResponeReviewType>> => {
  const response = await API.put(Endpoint().review.update(payload.id), {
    rating: payload.rating,
    content: payload.content
  });
  return response.data;
};

export const fetchDeleteReview = async (payload: DeleteReviewPayload) => {
  const response = await API.delete(Endpoint().review.delete(payload.id));
  return response.data;
};

