export type CreateReviewPayload = {
  orderItemId: string;
  productId: string;
  rating: number;
  content: string;
}


export type EditReviewPayload = {
  id: string;
  rating: number;
  content: string;
}

export type DeleteReviewPayload = {
  id: string;
}