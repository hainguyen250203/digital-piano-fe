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
}

export interface Product {
  id: string;
  name: string;
  defaultImage: DefaultImage;
}

export interface OrderItem {
  id: string;
  productId: string;
  price: number;
  quantity: number;
  productName?: string;
  totalPrice?: number;
  product: Product;
}

export interface ResponseOrder {
  id: string;
  userId: string;
  addressId: string;
  discountId?: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  paidAt?: Date;
  discountAmount?: number;
  orderTotal: number;
  shippingFee?: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  address?: ResponseAddress;
  paymentUrl?: string;
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
