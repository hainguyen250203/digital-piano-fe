import API from "@/services/axios";
import Endpoint from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";

export interface WishlistItemData {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    salePrice: number | null;
    defaultImage: {
      id: string;
      url: string;
    } | null;
  };
}


export const fetchWishlistList = async (): Promise<BaseResponse<WishlistItemData[]>> => {
  const { data } = await API.get(Endpoint().wishlist.list);
  return data;
};


export const fetchAddToWishlist = async (productId: string): Promise<BaseResponse<WishlistItemData>> => {
  const { data } = await API.post(Endpoint().wishlist.add, { productId });
  return data;
};

export const fetchDeleteFromWishlist = async (wishlistId: string): Promise<BaseResponse<null>> => {
  const { data } = await API.delete(Endpoint().wishlist.delete(wishlistId));
  return data;
};

export const fetchDeleteFromWishlistByProduct = async (productId: string): Promise<BaseResponse<null>> => {
  const { data } = await API.delete(Endpoint().wishlist.deleteByProduct(productId));
  return data;
}; 