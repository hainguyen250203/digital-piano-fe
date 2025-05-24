import { QueryKey } from '@/models/QueryKey';
import {
  CreateInvoiceData,
  UpdateInvoiceWithItemsDto,
  fetchCreateInvoice,
  fetchDeleteInvoice,
  fetchInvoiceById,
  fetchInvoiceList,
  fetchUpdateInvoice,
} from '@/services/apis/invoice';
import { BaseResponse } from '@/types/base-response';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface ProductInfo {
  id: string;
  name: string;
}

export interface SupplierData {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

export interface InvoiceItemData {
  id: string;
  invoiceId: string;
  productId: string;
  quantity: number;
  importPrice: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
  product?: ProductInfo;
}

export interface InvoiceData {
  id: string;
  supplierId: string;
  totalAmount: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  supplier: SupplierData;
  items: InvoiceItemData[];
}

export interface CreateInvoiceFormData {
  supplierId: string;
  note: string;
  items: {
    productId: string;
    quantity: number;
    importPrice: number;
  }[];
}

export interface InvoiceListResponse {
  message: string;
  errorCode: number;
  data: InvoiceData[];
}

export interface InvoiceDetailResponse {
  message: string;
  errorCode: number;
  data: InvoiceData;
}

export const useFetchInvoiceList = () => {
  return useQuery<InvoiceListResponse, Error>({
    queryKey: [QueryKey.INVOICE_LIST],
    queryFn: fetchInvoiceList,
  });
};

export const useFetchInvoiceById = (id: string) => {
  return useQuery<InvoiceDetailResponse, Error>({
    queryKey: [QueryKey.INVOICE_DETAIL, id],
    queryFn: () => fetchInvoiceById(id),
    enabled: !!id,
  });
};

export const useFetchCreateInvoice = (options?: {
  onSuccess?: (data: BaseResponse<InvoiceData>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateInvoiceData) => fetchCreateInvoice(body),
    onSuccess: (data: BaseResponse<InvoiceData>) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.INVOICE_LIST] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: BaseResponse<null>) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

export const useFetchUpdateInvoice = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceWithItemsDto }) => fetchUpdateInvoice(id, data),
    onSuccess: (data: BaseResponse<null>) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.INVOICE_LIST] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.INVOICE_DETAIL] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_LIST] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: BaseResponse<null>) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

export const useFetchDeleteInvoice = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetchDeleteInvoice(id),
    onSuccess: (data: BaseResponse<null>) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.INVOICE_LIST] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: BaseResponse<null>) => {
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

export const useFetchDeleteInvoiceItem = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (id: string) => fetchDeleteInvoice(id),
    ...options,
  });
}; 