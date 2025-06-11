import { QueryKey } from "@/models/QueryKey";
import { fetchCreateProduct, fetchDeleteProduct, fetchProductDetail, fetchProductFeatured, fetchProductHotSale, fetchProductList, fetchProductListByBrand, fetchProductListByCategory, fetchProductListByProductType, fetchProductListBySubCategory, fetchProductRelated, fetchUpdateProduct, fetchUpdateProductImages } from "@/services/apis/product";
import { BaseResponse } from "@/types/base-response";
import { ProductDetailData, ProductListData, ResponseDeleteProductType, ResponseUpdateProductType } from "@/types/product.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


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
  onSuccess?: (data: BaseResponse<ProductListData>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: FormData) => {
      try {
        const result = await fetchCreateProduct(data);
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<BaseResponse<ProductListData[]>>(
        [QueryKey.PRODUCT_LIST],
        (old) => {
          if (!old?.data) { return old; } const newData = { ...old, data: [data.data, ...(old.data || [])] };
          return newData;
        }
      );
      options?.onSuccess?.(data);
    },
    onError: (error: BaseResponse<null>) => {
      options?.onError?.(error);
    },
  });
};

export const useFetchUpdateProduct = (options?: {
  onSuccess?: (data: BaseResponse<ResponseUpdateProductType>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      fetchUpdateProduct(id, data),
    onSuccess: (res) => {
      const updated = res.data;

      // Cập nhật danh sách sản phẩm
      queryClient.setQueryData<BaseResponse<ProductListData[]>>(
        [QueryKey.PRODUCT_LIST],
        (old) => {
          if (!old?.data) return old;
          const newData = old.data.map((item) =>
            item.id === updated.id
              ? {
                ...item,
                name: updated.name,
                price: updated.price,
                salePrice: updated.salePrice,
                isHotSale: updated.isHotSale,
                isFeatured: updated.isFeatured,
                isDeleted: updated.isDeleted,
                createdAt: updated.createdAt,
                brand: updated.brand,
                productType: updated.productType,
                subCategory: updated.subCategory,
                category: updated.category,
                defaultImage: updated.defaultImage,
                stock: typeof updated.stock === 'number'
                  ? { quantity: updated.stock }
                  : null,
              }
              : item
          );

          return { ...old, data: newData };
        }
      );

      // Cập nhật chi tiết sản phẩm
      queryClient.setQueryData<BaseResponse<ProductDetailData>>(
        [QueryKey.PRODUCT_DETAIL, updated.id],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: {
              ...old.data,
              ...updated,
              stock: typeof updated.stock === 'number'
                ? { quantity: updated.stock }
                : null,
              reviews: updated.reviews.map((r) => ({
                id: r.id,
                rating: r.rating,
                content: r.content,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
                user: {
                  id: r.user.id,
                  email: '', // Không có email từ API
                  avatarUrl: r.user.avatarUrl ?? null,
                },
              })),
              // Parse description từ string -> DescriptionBlock[]
              description: (() => {
                try {
                  return JSON.parse(updated.description);
                } catch {
                  return []; // fallback nếu lỗi parse
                }
              })(),
            },
          };
        }
      );

      options?.onSuccess?.(res);
    },
    onError: (error: BaseResponse<null>) => {
      options?.onError?.(error);
      return error.message;
    },
  });
};


export const useFetchDeleteProduct = (options?: {
  onSuccess?: (data: BaseResponse<ResponseDeleteProductType>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => fetchDeleteProduct(id),
    onSuccess: (res) => {
      const deleted = res.data;

      // Cập nhật danh sách sản phẩm
      queryClient.setQueryData<BaseResponse<ProductListData[]>>(
        [QueryKey.PRODUCT_LIST],
        (old) => {
          if (!old?.data) return old;
          const updatedData = old.data.map((item) =>
            item.id === deleted.id
              ? { ...item, isDeleted: deleted.isDeleted }
              : item
          );
          return { ...old, data: updatedData };
        }
      )
      options?.onSuccess?.(res)
    },
    onError: (error: BaseResponse<null>) => {
      return error.message
    },
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

