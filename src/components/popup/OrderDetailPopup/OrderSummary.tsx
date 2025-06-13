'use client'

import { ResponseOrder } from '@/types/order.type'
import { formatCurrency } from '@/utils/format'
import { calculateSubtotal } from '@/utils/order'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { Box, Divider, Paper, Stack, Typography } from '@mui/material'
import { memo, useMemo } from 'react'

interface OrderSummaryProps {
  orderData: ResponseOrder
}

// Use React.memo to prevent unnecessary re-renders
export default memo(function OrderSummary({ orderData }: OrderSummaryProps) {
  // Memoize subtotal calculation
  const subtotal = useMemo(() => calculateSubtotal(orderData?.items), [orderData?.items])

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant='subtitle1' fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ReceiptIcon fontSize='small' color='primary' />
        Tổng Quan Đơn Hàng
      </Typography>

      <Stack spacing={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='body2'>Tạm tính:</Typography>
          <Typography variant='body2'>{formatCurrency(subtotal)}</Typography>
        </Box>

        {orderData.shippingFee !== undefined && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='body2'>Phí vận chuyển:</Typography>
            <Typography variant='body2'>{formatCurrency(orderData.shippingFee)}</Typography>
          </Box>
        )}

        {orderData.discountAmount && orderData.discountAmount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='body2'>Giảm giá:</Typography>
            <Typography variant='body2' color='error.main'>
              - {formatCurrency(orderData.discountAmount)}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='subtitle2' fontWeight={600}>
            Tổng cộng:
          </Typography>
          <Typography variant='subtitle2' fontWeight={600} color='primary.main'>
            {formatCurrency(orderData.orderTotal)}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
})
