import { QueryKey } from "@/models/QueryKey"
import { addToCart, deleteCartItem, FetchUpdateCartItem, getCart } from "@/services/apis/cart"
import { BaseResponse } from "@/types/base-response"
import { AddProductToCart, CartItemType, ResCartType, UpdateCartItem } from "@/types/cart.type"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFetchAddToCart = (options?: {
  onSuccess?: (data: BaseResponse<CartItemType>) => void
  onError?: (error: BaseResponse<null>) => void
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (addProductToCart: AddProductToCart) => {
      return addToCart(addProductToCart)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.GET_CART] })
    },
    onSuccess: async (data) => {
      const currentCart = queryClient.getQueryData<BaseResponse<ResCartType>>([QueryKey.GET_CART])

      if (!currentCart?.data) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.GET_CART] })
        return
      }

      const updatedItems = [...currentCart.data.items]
      const existingItemIndex = updatedItems.findIndex(item => item.product.id === data.data.product.id)

      if (existingItemIndex !== -1) {
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + data.data.quantity
        }
      } else {
        updatedItems.push(data.data)
      }

      queryClient.setQueryData([QueryKey.GET_CART], {
        ...currentCart,
        data: {
          ...currentCart.data,
          items: updatedItems,
          totalQuantity: currentCart.data.totalQuantity + data.data.quantity,
          totalPrice: currentCart.data.totalPrice + (data.data.product.price * data.data.quantity)
        }
      })

      options?.onSuccess?.(data)
    },

  })
}

export const useFetchGetCart = (options?: {
  onSuccess?: (data: BaseResponse<ResCartType>) => void
  onError?: (error: BaseResponse<null>) => void
}) => {
  return useQuery({
    queryKey: [QueryKey.GET_CART],
    queryFn: () => getCart(),
    ...options
  })
}

export const useFetchUpdateCartItem = (options?: {
  onSuccess?: (data: BaseResponse<CartItemType>) => void
  onError?: (error: BaseResponse<null>) => void
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updateCartItem: UpdateCartItem) => {
      const { cartItemId, quantity } = updateCartItem
      return FetchUpdateCartItem(cartItemId, quantity)
    },
    onSuccess: (data: BaseResponse<CartItemType>) => {
      console.log('Update cart item success - Response data:', data);

      queryClient.setQueryData<BaseResponse<ResCartType>>(
        [QueryKey.GET_CART],
        (old) => {
          console.log('Current cart cache before update:', old);

          if (!old?.data) {
            console.log('No existing cart cache found');
            return old;
          }

          const updatedItems = old.data.items.map(item => {
            if (item.id === data.data.id) {
              console.log('Updating quantity for item:', item.id);
              return {
                ...item,
                quantity: data.data.quantity
              };
            }
            return item;
          });

          const existingItem = old.data.items.find(item => item.id === data.data.id);
          const totalQuantityDiff = existingItem ? data.data.quantity - existingItem.quantity : 0;
          const totalPriceDiff = (data.data.product.price * totalQuantityDiff);

          const newCache = {
            ...old,
            data: {
              ...old.data,
              items: updatedItems,
              totalQuantity: old.data.totalQuantity + totalQuantityDiff,
              totalPrice: old.data.totalPrice + totalPriceDiff
            }
          };

          console.log('Updated cart cache:', newCache);
          return newCache;
        }
      );
      options?.onSuccess?.(data);
    },
    ...options
  })
}

export const useFetchDeleteCartItem = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void
  onError?: (error: BaseResponse<null>) => void
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCartItem(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QueryKey.GET_CART] })
    },
    onSuccess: async (data, deletedItemId) => {
      const currentCart = queryClient.getQueryData<BaseResponse<ResCartType>>([QueryKey.GET_CART])

      if (!currentCart?.data) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.GET_CART] })
        return
      }

      const deletedItem = currentCart.data.items.find(item => item.id === deletedItemId)
      if (!deletedItem) return

      const updatedItems = currentCart.data.items.filter(item => item.id !== deletedItemId)

      queryClient.setQueryData([QueryKey.GET_CART], {
        ...currentCart,
        data: {
          ...currentCart.data,
          items: updatedItems,
          totalQuantity: currentCart.data.totalQuantity - deletedItem.quantity,
          totalPrice: currentCart.data.totalPrice - (deletedItem.product.price * deletedItem.quantity)
        }
      })

      options?.onSuccess?.(data)
    }
  })
}
