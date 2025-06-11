'use client'

import { OrderStatus, ResponseOrder } from '@/types/order.type'
import { formatPaymentMethod, getPaymentStatusColor, getPaymentStatusText, needsPayment } from '@/utils/order'
import PaymentIcon from '@mui/icons-material/Payment'
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import { memo } from 'react'

interface OrderPaymentProps {
  orderData: ResponseOrder // Using 'any' temporarily, should be replaced with proper type
  handlePayAgain: () => void
  isRepaymentLoading?: boolean
}

// Use React.memo to prevent unnecessary re-renders
export default memo(function OrderPayment({ orderData, handlePayAgain, isRepaymentLoading }: OrderPaymentProps) {
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
      <Typography variant='subtitle1' fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PaymentIcon fontSize='small' color='primary' />
        Thông Tin Thanh Toán
      </Typography>

      <Stack spacing={1} sx={{ ml: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='body2'>Phương thức thanh toán:</Typography>
          <Typography variant='body2' fontWeight={500}>
            {formatPaymentMethod(orderData.paymentMethod)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='body2'>Trạng thái thanh toán:</Typography>
          <Chip size='small' label={getPaymentStatusText(orderData.paymentStatus)} color={getPaymentStatusColor(orderData.paymentStatus)} />
        </Box>
        {orderData.paidAt && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='body2'>Ngày thanh toán:</Typography>
            <Typography variant='body2'>{new Date(orderData.paidAt).toLocaleDateString('vi-VN')}</Typography>
          </Box>
        )}
        {orderData.transactionId && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='body2'>Mã giao dịch:</Typography>
            <Typography variant='body2' fontWeight={500}>
              {orderData.transactionId}
            </Typography>
          </Box>
        )}
      </Stack>

      {needsPayment(orderData) && orderData.orderStatus === OrderStatus.PENDING && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            color='warning'
            startIcon={<PaymentIcon />}
            onClick={handlePayAgain}
            sx={{
              'bgcolor': '#ffa726',
              '&:hover': {
                bgcolor: '#f57c00'
              }
            }}
            disabled={isRepaymentLoading}
          >
            {isRepaymentLoading ? 'Đang thanh toán...' : 'Thanh Toán Ngay'}
          </Button>
        </Box>
      )}
    </Paper>
  )
})
