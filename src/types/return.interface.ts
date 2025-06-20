// product-return.interface.ts

export enum ReturnStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export interface CreateProductReturnDto {
  orderItemId: string;
  quantity: number;
  reason: string;
}

export interface UpdateProductReturnStatusDto {
  status: ReturnStatus;
}

// Chi tiết ảnh sản phẩm
export interface ProductImage {
  id: string;
  url: string;
  productId: string;
  createdAt: string; // hoặc Date nếu bạn sẽ chuyển sang Date sau khi nhận từ API
  updatedAt: string;
}

// Sản phẩm bên trong orderItem
export interface OrderProduct {
  name: string;
  defaultImage?: ProductImage;
}

// Order Item chứa thông tin sản phẩm đã mua
export interface OrderItem {
  id: string;
  product: OrderProduct;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// Kết quả trả hàng
export interface ResProductReturn {
  id: string;
  orderId: string;
  orderItemId: string;
  quantity: number;
  reason: string;
  status: ReturnStatus;
  createdAt: string;
  updatedAt: string;
  orderItem: OrderItem;
}
