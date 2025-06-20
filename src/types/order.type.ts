import { ResponseAddress } from "./address.type";

export enum PaymentMethod {
  CASH = 'cash',
  VNPAY = 'vnpay',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface CreateOrderPayload {
  addressId: string;
  discountCode?: string;
  paymentMethod: PaymentMethod;
  note?: string;
}

export interface ResponseRepayment {
  paymentUrl: string;
}

export interface UpdateOrderStatusPayload {
  id: string;
  status: OrderStatus;
}

export interface DefaultImage {
  id: string;
  url: string;
  productId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Product {
  id: string;
  name: string;
  defaultImage: DefaultImage;
  reviews?: ProductReview[];
}

export interface ProductReview {
  id: string;
  userId: string;
  productId: string;
  orderItemId: string;
  rating: number;
  content: string;
  isDeleted: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProductReturnInOrderItem {
  id: string;
  status: string;
  quantity: number;
  createdAt: string;
  orderItem: {
    id: string;
    product: {
      id: string;
      name: string;
      defaultImage: DefaultImage;
    };
  };
}

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: string;
  price: number;
  quantity: number;
  productName?: string;
  totalPrice?: number;
  product: Product;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  productReturns?: ProductReturnInOrderItem[];
}

export interface ResponseReview {
  id: string;
  userId: string;
  rating: number;
  orderItemId: string;
  productId: string;
  content: string;
  isDeleted: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ResponseDiscount {
  id: string;
  code: string;
  discountPercent: number;
  maxAmount?: number;
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
}

export interface ResponseOrder {
  id: string;
  userId: string;
  addressId: string;
  discountId?: string | null;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string | null;
  paidAt?: Date | string | null;
  discountAmount?: number | null;
  orderTotal: number;
  shippingFee?: number | null;
  note?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  items: OrderItem[];
  address?: ResponseAddress;
  paymentUrl?: string;
  discount?: ResponseDiscount | null;
  user?: ResponseUser;
}

export interface ResponseUser {
  id: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  role: string;
  otpCode?: number;
  otpSecret?: string;
  count?: number;
  isBlock?: boolean;
  isDeleted?: boolean;
  otpExpiredAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface VNPayReturnParams {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

export interface ResponseVerifyReturnUrl {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
  isVerified: boolean;
  isSuccess: boolean;
  message: string;
}
