export type CreateReviewPayload = {
  orderItemId: string;
  productId: string;
  rating: number;
  content: string;
}


export type EditReviewPayload = {
  id: string;
  rating?: number;
  content?: string;
}

export type DeleteReviewPayload = {
  id: string;
}

export type ResponeReviewType = {
  id: string;
  userId: string;
  productId: string;
  orderItemId: string;
  rating: number; // số sao, ví dụ: 1–5
  content: string; // nội dung đánh giá
  isDeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
