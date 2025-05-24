import { fetchCreateAddress, fetchDeleteAddress, fetchGetAddressDetail, fetchGetAddressList, fetchSetDefaultAddress, fetchUpdateAddress } from "@/services/apis/address";
import { useMutation, useQuery } from "@tanstack/react-query";

import { QueryKey } from "@/models/QueryKey";
import { CreateAddressPayload, ResponseAddress, UpdateAddressPayload } from "@/types/address.type";
import { BaseResponse } from "@/types/base-response";



export const useFetchAddressList = (options?: {
  onSuccess?: (data: BaseResponse<ResponseAddress[]>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useQuery({
    queryKey: [QueryKey.ADDRESS_LIST],
    queryFn: fetchGetAddressList,
    ...options,
  });
};

export const useFetchAddressDetail = (id: string, options: {
  onSuccess?: (data: BaseResponse<ResponseAddress>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useQuery({
    queryKey: [QueryKey.ADDRESS_DETAIL, id],
    queryFn: () => fetchGetAddressDetail(id),
    ...options,
  });
};

export const useFetchCreateAddress = (options?: {
  onSuccess?: (data: BaseResponse<ResponseAddress>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => fetchCreateAddress(payload),
    ...options,
  });
};

export const useFetchUpdateAddress = (options?: {
  onSuccess?: (data: BaseResponse<ResponseAddress>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (payload: UpdateAddressPayload) => fetchUpdateAddress(payload),
    ...options,
  });
};

export const useFetchDeleteAddress = (options?: {
  onSuccess?: (data: BaseResponse<ResponseAddress>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (id: string) => fetchDeleteAddress(id),
    ...options,
  });
};

export const useFetchSetDefaultAddress = (options?: {
  onSuccess?: (data: BaseResponse<ResponseAddress>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (id: string) => fetchSetDefaultAddress(id),
    ...options,
  });
};


