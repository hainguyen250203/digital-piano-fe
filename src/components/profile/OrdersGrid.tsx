'use client'

import { ResponseOrder } from '@/types/order.type'
import { formatDateTimeFromAny } from '@/utils/format'
import { formatNumber, formatPaymentMethod, getPaymentStatusColor, getPaymentStatusText, getStatusColor, getStatusIcon, getStatusText } from '@/utils/order'
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material'
import OrderActions from './OrderActions'

interface OrdersGridProps {
  orders: ResponseOrder[]
  isUserCancelOrderLoading: boolean
  onOpenDetail: (orderId: string) => void
  onCancelOrder: (orderId: string) => void
  onOrderStatusChange: () => void
}

export default function OrdersGrid({
  orders,
  isUserCancelOrderLoading,
  onOpenDetail,
  onCancelOrder,
  onOrderStatusChange
}: OrdersGridProps) {
  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        {orders.map(order => (
          <Card 
            key={order.id}
            elevation={1} 
            sx={{ 
              borderRadius: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              {/* Order ID and Date */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Mã đơn hàng: {order.id}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDateTimeFromAny(order.createdAt)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              {/* Order Status and Payment */}
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  icon={getStatusIcon(order.orderStatus)} 
                  label={getStatusText(order.orderStatus)} 
                  size="small" 
                  color={getStatusColor(order.orderStatus)} 
                />
                <Chip 
                  label={getPaymentStatusText(order.paymentStatus)} 
                  size="small" 
                  color={getPaymentStatusColor(order.paymentStatus)} 
                />
              </Stack>
              
              {/* Order Details */}
              <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap' }}>
                <Box sx={{ width: '50%', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Phương thức thanh toán
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatPaymentMethod(order.paymentMethod)}
                  </Typography>
                </Box>
                <Box sx={{ width: '50%', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Tổng tiền
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                    {formatNumber(order.orderTotal)} VNĐ
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              {/* Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                <OrderActions
                  order={order}
                  isUserCancelOrderLoading={isUserCancelOrderLoading}
                  onOpenDetail={onOpenDetail}
                  onCancelOrder={onCancelOrder}
                  onOrderStatusChange={onOrderStatusChange}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
} 