import { QueryKey } from "@/models/QueryKey";
import { fetchCreateProduct, fetchDeleteProduct, fetchProductDetail, fetchProductFeatured, fetchProductHotSale, fetchProductList, fetchProductListByBrand, fetchProductListByCategory, fetchProductListByProductType, fetchProductListBySubCategory, fetchProductRelated, fetchUpdateProduct, fetchUpdateProductImages } from "@/services/apis/product";
import { BaseResponse } from "@/types/base-response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export type ProductListData = {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  isHotSale: boolean;
  isFeatured: boolean;
  isDeleted?: boolean;
  createdAt: string;
  brand: {
    id: string;
    name: string;
  };
  subCategory: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  productType: {
    id: string;
    name: string;
  } | null;
  defaultImage: {
    id: string;
    url: string;
  } | null;
  stock: {
    quantity: number;
  } | null;
};


export type ProductDetailData = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  videoUrl: string | null;
  isHotSale: boolean;
  isFeatured: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  brand: {
    id: string;
    name: string;
  };
  productType: {
    id: string;
    name: string;
  } | null;
  subCategory: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  defaultImage: {
    id: string;
    url: string;
  } | null;
  images: {
    id: string;
    url: string;
  }[];
  stock: {
    quantity: number;
  } | null;
};

export const useFetchProductList = () => {
  const options = {
    onSuccess: (data: BaseResponse<ProductListData[]>) => {
      return data.data
    },
    onError: (error: BaseResponse<null>) => {
      return error.message
    }
  }
  return useQuery({
    queryKey: [QueryKey.PRODUCT_LIST],
    queryFn: () => fetchProductList(),
    ...options
  });
};

export const useFetchProductHotSale = () => {
  return useQuery({
    queryKey: [QueryKey.PRODUCT_HOT_SALE],
    queryFn: () => fetchProductHotSale(),
  });
};

export const useFetchProductFeatured = () => {
  return useQuery({
    queryKey: [QueryKey.PRODUCT_FEATURED],
    queryFn: () => fetchProductFeatured(),
  });
};

export const useFetchProductRelated = (id: string) => {
  return useQuery({
    queryKey: [QueryKey.PRODUCT_RELATED, id],
    queryFn: () => fetchProductRelated(id),
  });
};

export const useFetchProductDetail = (id: string) => {
  return useQuery<BaseResponse<ProductDetailData>, Error>({
    queryKey: [QueryKey.PRODUCT_DETAIL, id],
    queryFn: () => fetchProductDetail(id),
    enabled: !!id,
  });
};

export const useFetchCreateProduct = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => fetchCreateProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_LIST] });
    },
    onError: (error: BaseResponse<null>) => {
      return error.message
    },
    ...options
  });
};

export const useFetchUpdateProduct = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => fetchUpdateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_LIST] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_DETAIL] });
    },
    onError: (error: BaseResponse<null>) => {
      return error.message
    },
    ...options
  });
};

export const useFetchDeleteProduct = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => fetchDeleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_LIST] });
    },
    onError: (error: BaseResponse<null>) => {
      return error.message
    },
    ...options
  });
};

export const useFetchUpdateProductImages = (options?: {
  onSuccess?: (data: BaseResponse<null>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => fetchUpdateProductImages(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_LIST] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_DETAIL] });
    },
    onError: (error: BaseResponse<null>) => {
      return error.message
    },
    ...options
  });
};


export const useFetchProductListByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: [QueryKey.PRODUCT_LIST_BY_CATEGORY, categoryId],
    queryFn: () => fetchProductListByCategory(categoryId),
  });
};

export const useFetchProductListBySubCategory = (subCategoryId: string) => {
  return useQuery({
    queryKey: [QueryKey.PRODUCT_LIST_BY_SUB_CATEGORY, subCategoryId],
    queryFn: () => fetchProductListBySubCategory(subCategoryId),
  });
};

export const useFetchProductListByProductType = (productTypeId: string) => {
  return useQuery({
    queryKey: [QueryKey.PRODUCT_LIST_BY_PRODUCT_TYPE, productTypeId],
    queryFn: () => fetchProductListByProductType(productTypeId),
  });
};

export const useFetchProductListByBrand = (brandId: string) => {
  return useQuery({
    queryKey: [QueryKey.PRODUCT_LIST_BY_BRAND, brandId],
    queryFn: () => fetchProductListByBrand(brandId),
  });
};

