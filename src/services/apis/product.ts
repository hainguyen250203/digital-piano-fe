import API from "@/services/axios";
import { Endpoint } from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";
import { ProductListByCollection, ProductListByProductType, ProductListBySubCategory, ProductListData, ResponseDeleteProductType, ResponseUpdateProductType } from "@/types/product.type";

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}


export const fetchProductList = async () => {
  const { data } = await API.get(Endpoint().product.list);
  return data;
};

export const fetchProductHotSale = async () => {
  const { data } = await API.get(Endpoint().product.getProductHotSale);
  return data.data;
};

export const fetchProductFeatured = async () => {
  const { data } = await API.get(Endpoint().product.getProductFeatured);
  return data.data;
};

export const fetchProductRelated = async (id: string) => {
  const { data } = await API.get(Endpoint().product.getProductRelated(id));
  return data.data;
};

export const fetchCreateProduct = async (createProductFormData: FormData): Promise<BaseResponse<ProductListData>> => {
  // Log form data 
  console.log("Product form data entries:");
  for (const [key, value] of createProductFormData.entries()) {
    if (value instanceof File) {
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  try {
    const { data } = await API.post(Endpoint().product.create, createProductFormData, { headers: { 'Content-Type': 'multipart/form-data', }, transformRequest: [(data) => data], }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchUpdateProduct = async (id: string, updateProductFormData: FormData): Promise<BaseResponse<ResponseUpdateProductType>> => {
  try {
    const { data } = await API.patch(
      Endpoint().product.update(id),
      updateProductFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Prevent axios from trying to JSON.stringify the FormData
        transformRequest: [(data) => data],
      }
    );
    console.log("Product updated:", data);
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const fetchDeleteProduct = async (id: string): Promise<BaseResponse<ResponseDeleteProductType>> => {
  try {
    const { data } = await API.delete(Endpoint().product.delete(id));
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const fetchProductDetail = async (id: string) => {
  try {
    const { data } = await API.get(Endpoint().product.detail(id));
    console.log("Product detail:", data);
    return data;
  } catch (error) {
    console.error("Error fetching product detail:", error);
    throw error;
  }
};

export const fetchUpdateProductImages = async (id: string, imagesFormData: FormData) => {
  try {
    const { data } = await API.patch(
      Endpoint().product.updateImages(id),
      imagesFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Prevent axios from trying to JSON.stringify the FormData
        transformRequest: [(data) => data],
      }
    );
    console.log("Product images updated:", data);
    return data;
  } catch (error) {
    console.error("Error updating product images:", error);
    throw error;
  }
};

export const fetchUpdateDefaultImage = async (id: string, defaultImageFile: File) => {
  try {
    const formData = new FormData();
    formData.append('defaultImage', defaultImageFile);

    const { data } = await API.patch(
      Endpoint().product.updateDefaultImage(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [(data) => data],
      }
    );
    console.log("Default image updated:", data);
    return data;
  } catch (error) {
    console.error("Error updating default image:", error);
    throw error;
  }
};

export const fetchSetDefaultImage = async (id: string, imageId: string) => {
  try {
    const { data } = await API.patch(
      Endpoint().product.setDefaultImage(id),
      { imageId }
    );
    console.log("Default image set:", data);
    return data;
  } catch (error) {
    console.error("Error setting default image:", error);
    throw error;
  }
};

export const fetchProductListByCategory = async (categoryId: string): Promise<BaseResponse<ProductListByCollection>> => {
  const { data } = await API.get(Endpoint().category.products(categoryId));
  return data;
};

export const fetchProductListBySubCategory = async (subCategoryId: string): Promise<BaseResponse<ProductListBySubCategory>> => {
  const { data } = await API.get(Endpoint().subCategory.products(subCategoryId));
  return data;
};

export const fetchProductListByProductType = async (productTypeId: string): Promise<BaseResponse<ProductListByProductType>> => {
  const { data } = await API.get(Endpoint().productType.products(productTypeId));
  return data;
};

export const fetchProductListByBrand = async (brandId: string): Promise<BaseResponse<ProductListByCollection>> => {
  const { data } = await API.get(Endpoint().brand.products(brandId));
  return data;
};



