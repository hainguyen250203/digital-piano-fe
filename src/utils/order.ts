import { OrderItem, OrderStatus, PaymentMethod, PaymentStatus, ResponseOrder } from '@/types/order.type'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import React from 'react'

// Order status utilities
export const getStatusColor = (status: OrderStatus | undefined) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'warning'
    case OrderStatus.PROCESSING:
      return 'info'
    case OrderStatus.SHIPPING:
      return 'primary'
    case OrderStatus.DELIVERED:
      return 'success'
    case OrderStatus.CANCELLED:
      return 'error'
    case OrderStatus.RETURNED:
      return 'secondary'
    default:
      return 'default'
  }
}

export const getStatusIcon = (status: OrderStatus | undefined) => {
  switch (status) {
    case OrderStatus.PENDING:
      return React.createElement(HourglassTopIcon, { fontSize: 'small' })
    case OrderStatus.PROCESSING:
      return React.createElement(InventoryIcon, { fontSize: 'small' })
    case OrderStatus.SHIPPING:
      return React.createElement(LocalShippingIcon, { fontSize: 'small' })
    case OrderStatus.DELIVERED:
      return React.createElement(ShoppingBagIcon, { fontSize: 'small' })
    case OrderStatus.CANCELLED:
      return React.createElement(CancelIcon, { fontSize: 'small' })
    case OrderStatus.RETURNED:
      return React.createElement(ReceiptIcon, { fontSize: 'small' })
    default:
      return React.createElement(ShoppingBagIcon, { fontSize: 'small' })
  }
}

export const getStatusText = (status: OrderStatus | undefined) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Chờ xác nhận'
    case OrderStatus.PROCESSING:
      return 'Đang xử lý'
    case OrderStatus.SHIPPING:
      return 'Đang giao hàng'
    case OrderStatus.DELIVERED:
      return 'Đã giao hàng'
    case OrderStatus.CANCELLED:
      return 'Đã hủy'
    case OrderStatus.RETURNED:
      return 'Đã trả hàng'
    default:
      return 'Không xác định'
  }
}

// Payment status utilities
export const getPaymentStatusColor = (status: PaymentStatus | undefined) => {
  switch (status) {
    case PaymentStatus.PAID:
      return 'success'
    case PaymentStatus.UNPAID:
      return 'warning'
    case PaymentStatus.FAILED:
      return 'error'
    case PaymentStatus.REFUNDED:
      return 'info'
    default:
      return 'default'
  }
}

export const getPaymentStatusText = (status: PaymentStatus | undefined) => {
  switch (status) {
    case PaymentStatus.PAID:
      return 'Đã thanh toán'
    case PaymentStatus.UNPAID:
      return 'Chờ thanh toán'
    case PaymentStatus.FAILED:
      return 'Thanh toán thất bại'
    case PaymentStatus.REFUNDED:
      return 'Đã hoàn tiền'
    default:
      return 'Không xác định'
  }
}

export const formatPaymentMethod = (method: PaymentMethod | undefined) => {
  switch (method) {
    case PaymentMethod.CASH:
      return 'Thanh toán khi nhận hàng'
    case PaymentMethod.VNPAY:
      return 'VNPay'
    default:
      return 'Không xác định'
  }
}

// Order progress utilities
export function getOrderStep(status: OrderStatus | undefined): number {
  switch (status) {
    case OrderStatus.PENDING:
      return 0
    case OrderStatus.PROCESSING:
      return 1
    case OrderStatus.SHIPPING:
      return 2
    case OrderStatus.DELIVERED:
      return 3
    case OrderStatus.CANCELLED:
    case OrderStatus.RETURNED:
      return -1
    default:
      return 0
  }
}

export const getStepIcon = (step: number) => {
  switch (step) {
    case 0:
      return React.createElement(AccessTimeIcon, { fontSize: 'small' })
    case 1:
      return React.createElement(InventoryIcon, { fontSize: 'small' })
    case 2:
      return React.createElement(DeliveryDiningIcon, { fontSize: 'small' })
    case 3:
      return React.createElement(CheckCircleIcon, { fontSize: 'small' })
    default:
      return null
  }
}

// Check if order needs payment
export const needsPayment = (order: ResponseOrder | undefined) => {
  if (!order) return false
  return order.paymentMethod === PaymentMethod.VNPAY && 
    (order.paymentStatus === PaymentStatus.UNPAID || order.paymentStatus === PaymentStatus.FAILED)
}

// Safe number formatting
export const formatNumber = (value: number | null | undefined) => {
  return value != null ? value.toLocaleString('vi-VN') : '0'
}

// Calculate order subtotal
export const calculateSubtotal = (items: OrderItem[] | undefined) => {
  if (!Array.isArray(items)) return 0
  return items.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0)
} 