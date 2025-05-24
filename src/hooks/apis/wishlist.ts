import { QueryKey } from '@/models/QueryKey';
import { WishlistItemData, fetchAddToWishlist, fetchDeleteFromWishlist, fetchDeleteFromWishlistByProduct, fetchWishlistList } from '@/services/apis/wishlist';
import { BaseResponse } from '@/types/base-response';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useFetchWishlist = () => {
  return useQuery({
    queryKey: [QueryKey.WISHLIST_LIST],
    queryFn: () => fetchWishlistList(),
  });
};


export const useAddToWishlist = (options?: {
  onSuccess?: (data: BaseResponse<WishlistItemData>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (productId: string) => fetchAddToWishlist(productId),
    ...options,
  });
};

export const useDeleteFromWishlist = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (wishlistId: string) => fetchDeleteFromWishlist(wishlistId),
    ...options,
  });
};

export const useDeleteFromWishlistByProduct = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (productId: string) => fetchDeleteFromWishlistByProduct(productId),
    ...options,
  });
}; 