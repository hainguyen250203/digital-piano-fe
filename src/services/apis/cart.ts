import API from "@/services/axios"
import Endpoint from "@/services/endpoint"
import { BaseResponse } from "@/types/base-response"
import { AddProductToCart, ResCartType } from "@/types/cart.type"

export const addToCart = async (addProductToCart: AddProductToCart): Promise<BaseResponse<null>> => {
  const { data } = await API.post(Endpoint().cart.addProductToCart, {
    productId: addProductToCart.productId
  })
  return data
}

export const getCart = async (): Promise<BaseResponse<ResCartType>> => {
  const { data } = await API.get(Endpoint().cart.getCart)
  return data
}

export const FetchUpdateCartItem = async (cartItemId: string, quantity: number): Promise<BaseResponse<null>> => {
  if (!cartItemId || typeof cartItemId !== 'string') {
    throw new Error('Invalid cart item ID')
  }
  
  const { data } = await API.patch(Endpoint().cart.updateCartItem(cartItemId), {
    quantity
  })
  return data
}

export const deleteCartItem = async (id: string): Promise<BaseResponse<null>> => {
  const { data } = await API.delete(Endpoint().cart.deleteCartItem(id))
  return data
}