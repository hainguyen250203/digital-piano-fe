import { QueryKey } from '@/models/QueryKey'
import { CreateSupplierData, UpdateSupplierData, createSupplier, deleteSupplier, getSupplierById, getSuppliers, updateSupplier } from '@/services/apis/supplier'
import { BaseResponse } from '@/types/base-response'
import { useMutation, useQuery } from '@tanstack/react-query'

export interface SupplierData {
  id: string
  name: string
  email: string
  phoneNumber: string
  address: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export const useFetchSupplierList = () => {
  return useQuery({
    queryKey: [QueryKey.SUPPLIER_LIST],
    queryFn: getSuppliers
  })
}

export const useFetchSupplierById = (id: string) => {
  return useQuery({
    queryKey: [QueryKey.SUPPLIER_DETAIL, id],
    queryFn: () => getSupplierById(id),
    enabled: !!id
  })
}



export const useFetchCreateSupplier = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}
) => {
  return useMutation({
    mutationFn: (data: CreateSupplierData) => createSupplier(data),
    ...options
  })
}

export const useFetchUpdateSupplier = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSupplierData }) => updateSupplier(id, data),
    ...options
  })
}


export const useFetchDeleteSupplier = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    ...options
  })
} 