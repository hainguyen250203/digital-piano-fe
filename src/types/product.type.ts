
// Description block types for structured product descriptions
export type DescriptionBlock =
  | { type: 'heading'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'specs'; content: string[] }
  | { type: 'image'; content: { src: string; alt: string } };
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

type Review = {
  id: string;
  userId: string;
  productId: string;
  orderItemId: string;
  rating: number;
  content: string;
  isDeleted: boolean;
  createdAt: string; // DateTime dưới dạng ISO string
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string
  };
};

export type ResponseDeleteProductType = {
  id: string,
  isDeleted: boolean;

}

export type ResponseUpdateProductType = {
  id: string;
  name: string;
  description: string,
  price: number;
  salePrice: number | null;
  videoUrl: string;
  defaultImage: {
    id: string;
    url: string;
  };
  isHotSale: boolean;
  isFeatured: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  brand: {
    id: string;
    name: string;
  };
  productType: {
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
  images: {
    id: string;
    url: string;
  }[];
  stock: number | null;
  reviews: Review[];
}


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
  reviews: {
    id: string;
    rating: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      email: string;
      avatarUrl: string | null;
    }
  }[]
};

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