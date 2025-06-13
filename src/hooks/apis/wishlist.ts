import { QueryKey } from '@/models/QueryKey';
import { WishlistItemData, fetchAddToWishlist, fetchDeleteFromWishlist, fetchDeleteFromWishlistByProduct, fetchWishlistList } from '@/services/apis/wishlist';
import { BaseResponse } from '@/types/base-response';
import { isAuthenticated } from '@/utils/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchWishlist = () => {
  return useQuery({
    queryKey: [QueryKey.WISHLIST_LIST],
    queryFn: () => fetchWishlistList(),
    enabled: isAuthenticated(),
  });
};

export const useAddToWishlist = (options?: {
  onSuccess?: (data: BaseResponse<WishlistItemData>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => fetchAddToWishlist(productId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.WISHLIST_LIST] })
    },
    onSuccess: async (data) => {
      const currentWishlist = queryClient.getQueryData<BaseResponse<WishlistItemData[]>>([QueryKey.WISHLIST_LIST])

      if (!currentWishlist?.data) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.WISHLIST_LIST] })
        return
      }

      queryClient.setQueryData([QueryKey.WISHLIST_LIST], {
        ...currentWishlist,
        data: [...currentWishlist.data, data.data]
      })

      options?.onSuccess?.(data)
    }
  });
};

export const useDeleteFromWishlist = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (wishlistId: string) => fetchDeleteFromWishlist(wishlistId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.WISHLIST_LIST] })
    },
    onSuccess: async (data, deletedWishlistId) => {
      const currentWishlist = queryClient.getQueryData<BaseResponse<WishlistItemData[]>>([QueryKey.WISHLIST_LIST])

      if (!currentWishlist?.data) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.WISHLIST_LIST] })
        return
      }

      queryClient.setQueryData([QueryKey.WISHLIST_LIST], {
        ...currentWishlist,
        data: currentWishlist.data.filter(item => item.id !== deletedWishlistId)
      })

      options?.onSuccess?.(data)
    }
  });
};

export const useDeleteFromWishlistByProduct = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => fetchDeleteFromWishlistByProduct(productId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.WISHLIST_LIST] })
    },
    onSuccess: async (data, deletedProductId) => {
      const currentWishlist = queryClient.getQueryData<BaseResponse<WishlistItemData[]>>([QueryKey.WISHLIST_LIST])

      if (!currentWishlist?.data) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.WISHLIST_LIST] })
        return
      }

      queryClient.setQueryData([QueryKey.WISHLIST_LIST], {
        ...currentWishlist,
        data: currentWishlist.data.filter(item => item.product.id !== deletedProductId)
      })

      options?.onSuccess?.(data)
    }
  });
}; 