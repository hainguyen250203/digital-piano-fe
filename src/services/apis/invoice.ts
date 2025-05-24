import API from "@/services/axios";
import { Endpoint } from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";

export interface InvoiceItemData {
  productId: string;
  quantity: number;
  importPrice: number;
}

export interface CreateInvoiceData {
  supplierId: string;
  note?: string;
  items: InvoiceItemData[];
}

export interface InvoiceData {
  id: string;
  supplierId: string;
  totalAmount: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  supplier: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
  };
  items: {
    id: string;
    invoiceId: string;
    productId: string;
    quantity: number;
    importPrice: number;
    subtotal: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

// Basic invoice update DTO
export interface UpdateInvoiceDto {
  supplierId?: string;
  note?: string;
}

// Single invoice item update DTO
export interface UpdateInvoiceItemDto {
  quantity?: number;
  importPrice?: number;
}

export interface BatchUpdateItemDto {
  id: string;
  quantity?: number;
  importPrice?: number;
}

export interface BatchUpdateInvoiceItemsDto {
  items: BatchUpdateItemDto[];
}

// Combined DTO for updating invoice and its items
export interface UpdateInvoiceWithItemsDto {
  supplierId?: string;
  note?: string;
  items?: BatchUpdateItemDto[];
}

export const fetchInvoiceList = async () => {
  const { data } = await API.get(Endpoint().invoice.list);
  return data;
};

export const fetchCreateInvoice = async (createInvoiceData: CreateInvoiceData): Promise<BaseResponse<InvoiceData>> => {
  const { data } = await API.post(Endpoint().invoice.create, createInvoiceData);
  return data;
};

export const fetchUpdateInvoice = async (id: string, updateInvoiceData: UpdateInvoiceWithItemsDto): Promise<BaseResponse<null>> => {
  const { data } = await API.patch(Endpoint().invoice.update(id), updateInvoiceData);
  return data;
};


export const fetchDeleteInvoice = async (id: string): Promise<BaseResponse<null>> => {
  const { data } = await API.delete(Endpoint().invoice.delete(id));
  return data;
};

export const fetchInvoiceById = async (id: string) => {
  const { data } = await API.get(Endpoint().invoice.detail(id));
  return data;
};
