export type AddProductToCart = {
  productId: string
}

export type UpdateCartItem = {
  cartItemId: string
  quantity: number
}

// Định nghĩa kiểu cho từng item trong giỏ hàng theo mẫu yêu cầu
export interface CartItemType {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    salePrice: number;
    defaultImage: {
      id: string;
      url: string;
      productId: string;
      createdAt: string;
      updatedAt: string;
    } | null;
  };
}

// Định nghĩa kiểu dữ liệu trả về cho giỏ hàng
export interface ResCartType {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItemType[];
}
