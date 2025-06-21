import { QueryKey } from "@/models/QueryKey"
import { addToCart, deleteCartItem, FetchUpdateCartItem, getCart } from "@/services/apis/cart"
import { BaseResponse } from "@/types/base-response"
import { AddProductToCart, CartItemType, ResCartType, UpdateCartItem } from "@/types/cart.type"
import { isAuthenticated } from "@/utils/auth"
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
    onSuccess: async (data: BaseResponse<CartItemType>) => {
      const currentCart = queryClient.getQueryData<BaseResponse<ResCartType>>([QueryKey.GET_CART])
      console.log('[AddToCart] Current cart cache:', currentCart)
      if (!currentCart?.data) {
        console.log('[AddToCart] No cache found, invalidating query')
        await queryClient.invalidateQueries({ queryKey: [QueryKey.GET_CART] })
        options?.onSuccess?.(data)
        return
      }
      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const existIndex = currentCart.data.items.findIndex(item => item.id === data.data.id)
      let updatedItems
      if (existIndex !== -1) {
        console.log('[AddToCart] Product existed in cart, updating item')
        updatedItems = currentCart.data.items.map(item =>
          item.id === data.data.id ? data.data : item
        )
      } else {
        console.log('[AddToCart] Product not in cart, adding new item')
        updatedItems = [...currentCart.data.items, data.data]
      }
      const newTotalQuantity = updatedItems.reduce((total, item) => total + item.quantity, 0)
      const newTotalPrice = updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      const newCart = {
        ...currentCart,
        data: {
          ...currentCart.data,
          items: updatedItems,
          totalQuantity: newTotalQuantity,
          totalPrice: newTotalPrice
        }
      }
      console.log('[AddToCart] Updated cart cache:', newCart)
      queryClient.setQueryData([QueryKey.GET_CART], newCart)
      options?.onSuccess?.(data)
    },
    onError: options?.onError
  })
}

export const useFetchGetCart = () => {
  return useQuery({
    queryKey: [QueryKey.GET_CART],
    queryFn: () => getCart(),
    enabled: isAuthenticated(),
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
