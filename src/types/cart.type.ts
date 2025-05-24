export type AddProductToCart = {
  productId: string
}

export type UpdateCartItem = {
  cartItemId: string
  quantity: number
}

// Định nghĩa kiểu cho hình ảnh mặc định của sản phẩm
interface ImageType {
  id: string;
  url: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa kiểu cho sản phẩm
interface ProductType {
  id: string;
  name: string;
  price: number;
  salePrice: number;
  defaultImage: ImageType;
}

// Định nghĩa kiểu cho từng item trong giỏ hàng
export interface CartItemType {
  id: string;
  quantity: number;
  product: ProductType;
}

// Định nghĩa kiểu dữ liệu trả về cho giỏ hàng
export interface ResCartType {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItemType[];
  totalQuantity: number;
  totalPrice: number;
}
