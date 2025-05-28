'use client'

import { useFetchGetOrderDetail } from '@/hooks/apis/order'
import { OrderStatus } from '@/types/order.type'
import { formatDateTimeFromAny } from '@/utils/format'
import {
  calculateSubtotal,
  formatNumber,
  formatPaymentMethod,
  getOrderStep,
  getPaymentStatusColor,
  getPaymentStatusText,
  getStatusColor,
  getStatusIcon,
  getStatusText,
  getStepIcon
} from '@/utils/order'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CancelIcon from '@mui/icons-material/Cancel'
import CloseIcon from '@mui/icons-material/Close'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PaymentIcon from '@mui/icons-material/Payment'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import { Avatar, Box, Button, Chip, CircularProgress, Dialog, DialogContent, Divider, IconButton, Paper, Stack, Step, StepLabel, Stepper, Typography, useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image'

interface ViewOrderModalProps {
  open: boolean
  onClose: () => void
  orderId: string
}

export default function ViewOrderModal({ open, onClose, orderId }: ViewOrderModalProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { data: orderResponse, isLoading } = useFetchGetOrderDetail(orderId)

  // Get the actual order data from the response
  const orderData = orderResponse?.data

  const activeStep = getOrderStep(orderData?.orderStatus)

  // Order steps for the stepper
  const steps = ['Đã đặt hàng', 'Đang xử lý', 'Đang giao hàng', 'Đã giao hàng']

  // Calculate subtotal (before shipping and discounts)
  const subtotal = calculateSubtotal(orderData?.items)

  // Show loading state
  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth PaperProps={{ sx: { borderRadius: 2, p: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography>Đang tải thông tin đơn hàng...</Typography>
        </Box>
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
          justifyContent: 'space-between'
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
        <Stack spacing={3} sx={{ p: 3 }}>
          {/* Order Header & Status */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant='h6' fontWeight={600} gutterBottom>
                  Đơn hàng #{orderData.id}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Ngày đặt: {orderData.createdAt ? formatDateTimeFromAny(orderData.createdAt) : 'N/A'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Cập nhật cuối: {orderData.updatedAt ? formatDateTimeFromAny(orderData.updatedAt) : 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mt: { xs: 2, sm: 0 }, flexWrap: 'wrap', gap: 1 }}>
                <Chip icon={getStatusIcon(orderData.orderStatus)} label={getStatusText(orderData.orderStatus)} color={getStatusColor(orderData.orderStatus)} />
                <Chip label={getPaymentStatusText(orderData.paymentStatus)} color={getPaymentStatusColor(orderData.paymentStatus)} />
              </Box>
            </Box>

            {activeStep >= 0 && (
              <Box sx={{ width: '100%', mt: 3 }}>
                <Stepper activeStep={activeStep} alternativeLabel={!isMobile}>
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              bgcolor: index <= activeStep ? 'primary.main' : 'grey.300',
                              color: 'white',
                              fontSize: '0.875rem'
                            }}
                          >
                            {getStepIcon(index)}
                          </Avatar>
                        )}
                      >
                        <Typography variant='caption' display='block' sx={{ mt: 0.5 }}>
                          {label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            )}

            {orderData.orderStatus === OrderStatus.CANCELLED && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'error.50', borderRadius: 2, border: '1px dashed', borderColor: 'error.main' }}>
                <Typography variant='subtitle2' color='error' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CancelIcon fontSize='small' />
                  Đơn hàng đã bị hủy
                </Typography>
              </Box>
            )}
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Customer Information */}
            <Box sx={{ flex: 1 }}>
              {orderData.address && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'background.paper'
                  }}
                >
                  <Typography variant='subtitle1' fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon fontSize='small' color='primary' />
                    Thông Tin Khách Hàng
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant='body1' fontWeight={500}>
                      {orderData.address.fullName}
                    </Typography>
                    <Typography variant='body2'>Số điện thoại: {orderData.address.phone}</Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                      Địa chỉ: {orderData.address.street}, {orderData.address.ward}, {orderData.address.district}, {orderData.address.city}
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Box>

            {/* Payment Information */}
            <Box sx={{ flex: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  height: '100%',
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

                <Stack spacing={1} sx={{ mt: 2 }}>
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
                      <Typography variant='body2'>{orderData.paidAt ? formatDateTimeFromAny(orderData.paidAt) : 'N/A'}</Typography>
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
              </Paper>
            </Box>
          </Box>

          {/* Order Items */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant='subtitle1' fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ShoppingBagIcon fontSize='small' color='primary' />
              Sản Phẩm Đã Đặt
            </Typography>

            <Stack spacing={2} divider={<Divider flexItem />}>
              {Array.isArray(orderData.items) && orderData.items.length > 0 ? (
                orderData.items.map(item => (
                  <Box key={item.id} sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        position: 'relative',
                        flexShrink: 0,
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {item.product.defaultImage.url ? (
                        <Image src={item.product.defaultImage.url} alt={item.productName || 'Sản phẩm'} layout='fill' objectFit='cover' />
                      ) : (
                        <Box sx={{ width: 80, height: 80, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant='caption'>Không có ảnh</Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='subtitle2'>{item.productName || `Sản phẩm #${item.productId}`}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, flexWrap: 'wrap' }}>
                        <Typography variant='body2' color='text.secondary'>
                          Số lượng: {item.quantity}
                        </Typography>
                        <Typography variant='body2' fontWeight={600}>
                          {formatNumber(item.price)} VNĐ
                        </Typography>
                      </Box>
                      <Typography variant='body2' fontWeight={600} sx={{ mt: 1, textAlign: 'right' }}>
                        Thành tiền: {formatNumber(item.price * item.quantity)} VNĐ
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ py: 2, textAlign: 'center' }}>
                  <Typography variant='body2' color='text.secondary'>
                    Không có thông tin sản phẩm
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>

          {/* Order Summary */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
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
                <Typography variant='body2'>{formatNumber(subtotal)} VNĐ</Typography>
              </Box>

              {orderData.shippingFee !== undefined && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Phí vận chuyển:</Typography>
                  <Typography variant='body2'>{formatNumber(orderData.shippingFee)} VNĐ</Typography>
                </Box>
              )}

              {orderData.discountAmount && orderData.discountAmount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2'>Giảm giá:</Typography>
                  <Typography variant='body2' color='error.main'>
                    - {formatNumber(orderData.discountAmount)} VNĐ
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='subtitle2' fontWeight={600}>
                  Tổng cộng:
                </Typography>
                <Typography variant='subtitle2' fontWeight={600} color='primary.main'>
                  {formatNumber(orderData.orderTotal)} VNĐ
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Additional Notes */}
          {orderData.note && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant='subtitle1' fontWeight={600} gutterBottom>
                Ghi Chú
              </Typography>
              <Typography variant='body2'>{orderData.note}</Typography>
            </Paper>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button variant='outlined' onClick={onClose} startIcon={<ArrowBackIcon />}>
              Đóng
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
