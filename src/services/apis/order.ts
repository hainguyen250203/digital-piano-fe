import API from "@/services/axios";
import Endpoint from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";
import { CreateOrderPayload, OrderStatus, PaymentMethod, ResponseOrder, ResponseRepayment, ResponseVerifyReturnUrl, VNPayReturnParams } from "@/types/order.type";

export const fetchCreateOrder = async (payload: CreateOrderPayload): Promise<BaseResponse<ResponseOrder>> => {
  const { data } = await API.post(Endpoint().order.create, payload);
  return data;
};

export const fetchVerifyReturnUrl = async (payload: VNPayReturnParams): Promise<BaseResponse<ResponseVerifyReturnUrl>> => {
  const { data } = await API.post(Endpoint().order.vnpayReturnUrl, payload);
  return data;
};

export const fetchGetMyOrders = async (): Promise<BaseResponse<ResponseOrder[]>> => {
  const { data } = await API.get(Endpoint().order.myOrders);
  return data;
};

export const fetchGetOrderDetail = async (id: string): Promise<BaseResponse<ResponseOrder>> => {
  const { data } = await API.get(Endpoint().order.detail(id));
  return data;
};

export const fetchUserCancelOrder = async (id: string): Promise<BaseResponse<ResponseOrder>> => {
  const { data } = await API.post(Endpoint().order.userCancel(id));
  return data;
};

// Admin API functions
export const fetchGetAllOrders = async (): Promise<BaseResponse<ResponseOrder[]>> => {
  const { data } = await API.get(Endpoint().order.list);
  return data;
};

export const fetchUpdateOrderStatus = async (id: string, status: OrderStatus): Promise<BaseResponse<ResponseOrder>> => {
  const { data } = await API.patch(Endpoint().order.updateStatus(id), { status });
  return data;
};

export const fetchRepayment = async (id: string): Promise<BaseResponse<ResponseRepayment>> => {
  const { data } = await API.post(Endpoint().order.repayment(id));
  return data;
}; 

export const fetchAdminCancelOrder = async (id: string): Promise<BaseResponse<ResponseOrder>> => {
  const { data } = await API.post(Endpoint().order.adminCancel(id));
  return data;
}; 

export const fetchUserConfirmDelivery = async (id: string): Promise<BaseResponse<ResponseOrder>> => {
  const { data } = await API.post(Endpoint().order.userConfirmDelivery(id));
  return data;
}; 

export const fetchUserChangePaymentMethod = async (id: string, paymentMethod: PaymentMethod): Promise<BaseResponse<ResponseOrder>> => {
  const { data } = await API.post(Endpoint().order.userChangePaymentMethod(id), { paymentMethod });
  return data;
};

export const fetchGetOrderDetailByUserId = async (orderId: string): Promise<BaseResponse<ResponseOrder>> => {
  const { data } = await API.get(Endpoint().order.OrderDetailByUserId(orderId));
  return data;
};