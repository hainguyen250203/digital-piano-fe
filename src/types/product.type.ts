import { ProductListData } from "@/hooks/apis/product";

// Description block types for structured product descriptions
export type DescriptionBlock =
  | { type: 'heading'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'specs'; content: string[] }
  | { type: 'image'; content: { src: string; alt: string } };

export type CreateProductFormData = {
  name: string;
  description: DescriptionBlock[];
  price: number;
  salePrice?: number | null;
  videoUrl?: string;
  isHotSale: boolean;
  isFeatured: boolean;
  productTypeId: string;
  brandId: string;
  subCategoryId: string;
  imageFiles: File[];
  defaultImage: File | null; // default product image
}

export interface ProductListByCollection {
  id: string;
  name: string;
  products: ProductListData[]
}

export interface ProductListBySubCategory extends ProductListByCollection {
  category: {
    id: string;
    name: string;
  }
  products: ProductListData[]
}

export interface ProductListByProductType extends ProductListByCollection {
  category: {
    id: string;
    name: string;
  }
  subCategory: {
    id: string;
    name: string;
  }
}