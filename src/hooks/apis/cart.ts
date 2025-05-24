import { QueryKey } from "@/models/QueryKey"
import { addToCart, deleteCartItem, FetchUpdateCartItem, getCart } from "@/services/apis/cart"
import { BaseResponse } from "@/types/base-response"
import { AddProductToCart, ResCartType, UpdateCartItem } from "@/types/cart.type"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useFetchAddToCart = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void
  onError?: (error: BaseResponse<null>) => void
}) => {
  return useMutation({
    mutationFn: (addProductToCart: AddProductToCart) => addToCart(addProductToCart),
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
  onSuccess?: (data: BaseResponse<null>) => void
  onError?: (error: BaseResponse<null>) => void
}) => {
  return useMutation({
    mutationFn: (updateCartItem: UpdateCartItem) => {
      const { cartItemId, quantity } = updateCartItem
      return FetchUpdateCartItem(cartItemId, quantity)
    },
    ...options
  })
}

export const useFetchDeleteCartItem = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void
  onError?: (error: BaseResponse<null>) => void
}) => {
  return useMutation({
    mutationFn: (id: string) => deleteCartItem(id),
    ...options
  })
}
