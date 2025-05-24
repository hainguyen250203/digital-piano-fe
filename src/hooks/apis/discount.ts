import { QueryKey } from '@/models/QueryKey';
import { DiscountType, fetchCreateDiscount, fetchDeleteDiscount, fetchDiscountList, fetchGetDiscountByCode, fetchUpdateDiscount, fetchValidateDiscount } from '@/services/apis/discount';
import { BaseResponse } from '@/types/base-response';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Export DiscountType enum and interfaces for use in components
export { DiscountType };

export interface DiscountData {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  value: number;
  startDate?: string | null;
  endDate?: string | null;
  maxUses?: number | null;
  minOrderTotal?: number | null;
  maxDiscountValue?: number | null;
  usedCount: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountListResponse {
  message: string;
  errorCode: number;
  data: DiscountData[];
}

export interface CreateDiscountData {
  code: string;
  description?: string;
  discountType: DiscountType;
  value: number;
  startDate?: string;
  endDate?: string;
  maxUses?: number;
  minOrderTotal?: number;
  maxDiscountValue?: number;
  isActive?: boolean;
}

export interface UpdateDiscountData {
  code?: string;
  description?: string;
  discountType?: DiscountType;
  value?: number;
  startDate?: string;
  endDate?: string;
  maxUses?: number;
  minOrderTotal?: number;
  maxDiscountValue?: number;
  isActive?: boolean;
  isDeleted?: boolean;
}

// Get all discounts
export const useFetchDiscountList = () => {
  return useQuery<DiscountListResponse, Error>({
    queryKey: [QueryKey.DISCOUNT_LIST],
    queryFn: fetchDiscountList,
  });
};

// Create discount
export const useFetchCreateDiscount = (options?: {
  onSuccess?: (data: BaseResponse<DiscountData>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (body: CreateDiscountData) => fetchCreateDiscount(body),
    ...options,
  });
};

// Update discount
export const useFetchUpdateDiscount = (
  options?: {
    onSuccess?: (data: BaseResponse<DiscountData>) => void;
    onError?: (error: BaseResponse<null>) => void;
  }
) => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDiscountData }) => fetchUpdateDiscount(id, data),
    ...options,
  });
};

// Delete discount
export const useFetchDeleteDiscount = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchDeleteDiscount(id),
    onSuccess: (data: BaseResponse<null>) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.DISCOUNT_LIST] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: BaseResponse<null>) => {
      if (options?.onError) {
        options.onError(error);
      }
      return error.message;
    }
  });
};

// Validate discount code
export const useFetchValidateDiscountCode = (options?: {
  onSuccess?: (data: BaseResponse<{ discountAmount: number }>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: ({ code, amount }: { code: string; amount: number }) => fetchValidateDiscount(code, amount),
    ...options,
  });
};

// Get discount by code
export const useFetchGetDiscountByCode = (options?: {
  onSuccess?: (data: BaseResponse<DiscountData>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (code: string) => fetchGetDiscountByCode(code),
    ...options,
  });
};
