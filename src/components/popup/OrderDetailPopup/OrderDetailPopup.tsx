'use client'

import { useFetchGetOrderDetailByUserId } from '@/hooks/apis/order'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Dialog, DialogContent, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'

// Import sub-components
import OrderAddress from '@/components/popup/OrderDetailPopup/OrderAddress'
import OrderDetailPopupSkeleton from '@/components/popup/OrderDetailPopup/OrderDetailPopupSkeleton'
import OrderHeader from '@/components/popup/OrderDetailPopup/OrderHeader'
import OrderItems from '@/components/popup/OrderDetailPopup/OrderItems'
import OrderNotes from '@/components/popup/OrderDetailPopup/OrderNotes'
import OrderPayment from '@/components/popup/OrderDetailPopup/OrderPayment'
import OrderSummary from '@/components/popup/OrderDetailPopup/OrderSummary'
import { ReviewContextProvider } from '@/components/popup/OrderDetailPopup/ReviewContext'

interface OrderDetailPopupProps {
  open: boolean
  onClose: () => void
  orderId: string
  onPayAgain?: (orderId: string) => void
  isRepaymentLoading?: boolean
}

export default function OrderDetailPopup({ open, onClose, orderId, onPayAgain, isRepaymentLoading }: OrderDetailPopupProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // API hooks with proper error handling
  const {
    mutate: getOrderDetail,
    data: orderResponse,
    isPending
  } = useFetchGetOrderDetailByUserId({
    onError: error => {
      toast.error(error?.message || 'Không thể tải thông tin đơn hàng')
    }
  })

  // Get the actual order data from the response
  const orderData = orderResponse?.data

  // Callback for payment actions - moved before conditional returns
  const handlePayAgain = useCallback(() => {
    if (onPayAgain && orderData) {
      onPayAgain(orderData.id)
      onClose()
    }
  }, [onPayAgain, orderData, onClose])

  // Fetch order details when orderId changes
  useEffect(() => {
    if (orderId && open) {
      getOrderDetail(orderId)
    }
  }, [orderId, getOrderDetail, open])

  // Show loading state
  if (isPending) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth='md' 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            m: isMobile ? 0 : 2,
            height: isMobile ? '100%' : 'auto',
            maxHeight: isMobile ? '100%' : '90vh',
            overflow: 'hidden'
          }
        }}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton color='inherit' onClick={onClose} size='small'>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant='h6' component='h2' fontWeight={600}>
              Chi Tiết Đơn Hàng
            </Typography>
          </Box>
          {!isMobile && (
            <IconButton size='small' onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <DialogContent sx={{ p: 0, overflow: 'auto' }}>
          <OrderDetailPopupSkeleton />
        </DialogContent>
      </Dialog>
    )
  }

  // If no order data is available
  if (!orderData) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth PaperProps={{ sx: { borderRadius: 2, p: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant='h6' color='error'>
            Không tìm thấy thông tin đơn hàng
          </Typography>
          <Button variant='outlined' onClick={onClose}>
            Đóng
          </Button>
        </Box>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          m: isMobile ? 0 : 2,
          height: isMobile ? '100%' : 'auto',
          maxHeight: isMobile ? '100%' : '90vh',
          overflow: 'hidden'
        }
      }}
    >
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile && (
            <IconButton color='inherit' onClick={onClose} size='small'>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant='h6' component='h2' fontWeight={600}>
            Chi Tiết Đơn Hàng
          </Typography>
        </Box>
        {!isMobile && (
          <IconButton size='small' onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <DialogContent sx={{ p: 0, overflow: 'auto' }}>
        <ReviewContextProvider orderId={orderId} refreshOrder={getOrderDetail}>
          <Stack spacing={2} sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Order Header & Status */}
            <OrderHeader orderData={orderData} isMobile={isMobile} />

            {/* Address Information */}
            {orderData.address && <OrderAddress address={orderData.address} />}

            {/* Payment Information */}
            <OrderPayment orderData={orderData} handlePayAgain={handlePayAgain} isRepaymentLoading={isRepaymentLoading} />

            {/* Order Items */}
            <OrderItems orderData={orderData} />

            {/* Order Summary */}
            <OrderSummary orderData={orderData} />

            {/* Additional Notes */}
            {orderData.note && <OrderNotes note={orderData.note} />}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Button variant='outlined' onClick={onClose} startIcon={<ArrowBackIcon />}>
                Quay Lại
              </Button>
            </Box>
          </Stack>
        </ReviewContextProvider>
      </DialogContent>
    </Dialog>
  )
}
