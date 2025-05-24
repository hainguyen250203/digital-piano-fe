import { QueryKey } from "@/models/QueryKey";
import { fetchAdminCancelOrder, fetchCreateOrder, fetchGetAllOrders, fetchGetMyOrders, fetchGetOrderDetail, fetchRepayment, fetchUpdateOrderStatus, fetchUserCancelOrder, fetchUserChangePaymentMethod, fetchUserConfirmDelivery, fetchVerifyReturnUrl } from "@/services/apis/order";
import { BaseResponse } from "@/types/base-response";
import { CreateOrderPayload, PaymentMethod, ResponseOrder, ResponseRepayment, ResponseVerifyReturnUrl, UpdateOrderStatusPayload, VNPayReturnParams } from "@/types/order.type";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFetchCreateOrder = (options?: {
  onSuccess?: (data: BaseResponse<ResponseOrder>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => fetchCreateOrder(payload),
    ...options
  });
};

export const useFetchGetMyOrders = (options?: {
  onSuccess?: (data: BaseResponse<ResponseOrder[]>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useQuery({
    queryKey: [QueryKey.MY_ORDERS],
    queryFn: () => fetchGetMyOrders(),
    ...options
  });
};

export const useFetchVerifyReturnUrl = (options?: {
  onSuccess?: (data: BaseResponse<ResponseVerifyReturnUrl>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (payload: VNPayReturnParams) => fetchVerifyReturnUrl(payload),
    ...options
  });
};

export const useFetchGetOrderDetail = (id: string, options?: {
  onSuccess?: (data: BaseResponse<ResponseOrder>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useQuery({
    queryKey: [QueryKey.ORDER_DETAIL, id],
    queryFn: () => fetchGetOrderDetail(id),
    ...options,
    enabled: !!id
  });
};

export const useFetchUserCancelOrder = (options?: {
  onSuccess?: (data: BaseResponse<ResponseOrder>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (id: string) => fetchUserCancelOrder(id),
    ...options
  });
};

// Admin hooks for order management
export const useFetchGetAllOrders = (options?: {
  onSuccess?: (data: BaseResponse<ResponseOrder[]>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useQuery({
    queryKey: [QueryKey.ORDER_LIST],
    queryFn: () => fetchGetAllOrders(),
    ...options
  });
};

export const useFetchUpdateOrderStatus = (options?: {
  onSuccess?: (data: BaseResponse<ResponseOrder>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: ({ id, status }: UpdateOrderStatusPayload) => fetchUpdateOrderStatus(id, status),
    ...options
  });
};

export const useFetchRepayment = (options?: {
  onSuccess?: (data: BaseResponse<ResponseRepayment>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (id: string) => fetchRepayment(id),
    ...options
  });
};

export const useFetchAdminCancelOrder = (options?: {
  onSuccess?: (data: BaseResponse<ResponseOrder>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (id: string) => fetchAdminCancelOrder(id),
    ...options
  });
};

export const useFetchUserConfirmDelivery = (options?: {
  onSuccess?: (data: BaseResponse<ResponseOrder>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (id: string) => fetchUserConfirmDelivery(id),
    ...options
  });
};

export const useFetchUserChangePaymentMethod = (options?: {
  onSuccess?: (data: BaseResponse<ResponseOrder>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: ({ id, paymentMethod }: { id: string; paymentMethod: PaymentMethod }) => fetchUserChangePaymentMethod(id, paymentMethod),
    ...options
  })
}