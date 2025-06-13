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
        updatedItems[existingItemIndex] = data.data
      } else {
        updatedItems.push(data.data)
      }

      const newTotalQuantity = updatedItems.reduce((total, item) => total + item.quantity, 0)

      queryClient.setQueryData([QueryKey.GET_CART], {
        ...currentCart,
        data: {
          ...currentCart.data,
          items: updatedItems,
          totalQuantity: newTotalQuantity,
          totalPrice: currentCart.data.totalPrice + (data.data.product.price * data.data.quantity)
        }
      })

      options?.onSuccess?.(data)
    },
    ...options
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
      queryClient.setQueryData<BaseResponse<ResCartType>>(
        [QueryKey.GET_CART],
        (old) => {
          if (!old?.data) return old

          const updatedItems = old.data.items.map(item =>
            item.id === data.data.id ? data.data : item
          )

          const newTotalQuantity = updatedItems.reduce((total, item) => total + item.quantity, 0)
          const newTotalPrice = updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)

          return {
            ...old,
            data: {
              ...old.data,
              items: updatedItems,
              totalQuantity: newTotalQuantity,
              totalPrice: newTotalPrice
            }
          }
        }
      )
      options?.onSuccess?.(data)
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
      queryClient.setQueryData<BaseResponse<ResCartType>>(
        [QueryKey.GET_CART],
        (old) => {
          if (!old?.data) return old

          const updatedItems = old.data.items.filter(item => item.id !== deletedItemId)

          const newTotalQuantity = updatedItems.reduce((total, item) => total + item.quantity, 0)
          const newTotalPrice = updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)

          return {
            ...old,
            data: {
              ...old.data,
              items: updatedItems,
              totalQuantity: newTotalQuantity,
              totalPrice: newTotalPrice
            }
          }
        }
      )

      options?.onSuccess?.(data)
    }
  })
}
