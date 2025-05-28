import API from "@/services/axios";
import Endpoint from "@/services/endpoint";
import { CreateReviewPayload, DeleteReviewPayload, EditReviewPayload } from "@/types/review.type";

export const fetchCreateReview = async (payload: CreateReviewPayload) => {
  const response = await API.post(Endpoint().review.create, payload);
  return response.data;
};

export const fetchUpdateReview = async (payload: EditReviewPayload) => {
  const response = await API.put(Endpoint().review.update(payload.id), payload);
  return response.data;
};

export const fetchDeleteReview = async (payload: DeleteReviewPayload) => {
  const response = await API.delete(Endpoint().review.delete(payload.id));
  return response.data;
};

