'use client'

import { useFetchGetOrderDetailByUserId } from '@/hooks/apis/order'
import { useFetchCreateReview, useFetchDeleteReview, useFetchUpdateReview } from '@/hooks/apis/review'
import { OrderItem, OrderStatus, ProductReview } from '@/types/order.type'
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
  getStepIcon,
  needsPayment
} from '@/utils/order'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CancelIcon from '@mui/icons-material/Cancel'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PaymentIcon from '@mui/icons-material/Payment'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ReceiptIcon from '@mui/icons-material/Receipt'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Paper,
  Rating,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface OrderDetailPopupProps {
  open: boolean
  onClose: () => void
  orderId: string
  onPayAgain?: (orderId: string) => void
  isRepaymentLoading?: boolean
}

interface ReviewFormData {
  id?: string
  orderItemId: string
  productId: string
  rating: number
  content: string
}

export default function OrderDetailPopup({ open, onClose, orderId, onPayAgain, isRepaymentLoading }: OrderDetailPopupProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [reviewForm, setReviewForm] = useState<ReviewFormData | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const { mutate: getOrderDetail, data: orderResponse, isPending } = useFetchGetOrderDetailByUserId()
  const { mutate: createReview, isPending: isCreatingReview } = useFetchCreateReview({
    onSuccess: () => {
      // Refetch order details to get updated reviews
      if (orderId) getOrderDetail(orderId)
      setReviewForm(null)
    }
  })

  const { mutate: updateReview, isPending: isUpdatingReview } = useFetchUpdateReview({
    onSuccess: () => {
      // Refetch order details to get updated reviews
      if (orderId) getOrderDetail(orderId)
      setReviewForm(null)
      setIsEditMode(false)
    }
  })

  const { mutate: deleteReview } = useFetchDeleteReview({
    onSuccess: () => {
      // Refetch order details to get updated reviews
      if (orderId) getOrderDetail(orderId)
    }
  })

  // Fetch order details when orderId changes
  useEffect(() => {
    if (orderId) {
      getOrderDetail(orderId)
    }
  }, [orderId, getOrderDetail])

  // Reset form state when loading new order data
  useEffect(() => {
    if (orderResponse) {
      setReviewForm(null)
      setIsEditMode(false)
    }
  }, [orderResponse])

  // Get the actual order data from the response
  const orderData = orderResponse?.data

  const activeStep = getOrderStep(orderData?.orderStatus)

  // Order steps for the stepper
  const steps = ['Đã đặt hàng', 'Đang xử lý', 'Đang giao hàng', 'Đã giao hàng']

  const handlePayAgain = () => {
    if (onPayAgain && orderData) {
      onPayAgain(orderData.id)
      onClose()
    }
  }

  // Calculate subtotal (before shipping and discounts)
  const subtotal = calculateSubtotal(orderData?.items)

  // Review handlers
  const handleOpenReviewForm = (item: OrderItem) => {
    setReviewForm({
      orderItemId: item.id,
      productId: item.productId,
      rating: 5,
      content: ''
    })
    setIsEditMode(false)
  }

  const handleEditReview = (review: ProductReview) => {
    setReviewForm({
      id: review.id,
      orderItemId: review.orderItemId,
      productId: review.productId,
      rating: review.rating,
      content: review.content
    })
    setIsEditMode(true)
  }

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      deleteReview({ id: reviewId })
    }
  }

  const handleSubmitReview = () => {
    if (!reviewForm) return

    if (isEditMode && reviewForm.id) {
      updateReview({
        id: reviewForm.id,
        rating: reviewForm.rating,
        content: reviewForm.content
      })
    } else {
      createReview({
        orderItemId: reviewForm.orderItemId,
        productId: reviewForm.productId,
        rating: reviewForm.rating,
        content: reviewForm.content
      })
    }
  }

  const handleCancelReview = () => {
    setReviewForm(null)
    setIsEditMode(false)
  }

  // Find review for a specific order item
  const findReviewForItem = (item: OrderItem) => {
    if (!item.product?.reviews || !Array.isArray(item.product.reviews)) return null
    return item.product.reviews.find(review => review.orderItemId === item.id)
  }

  // Show loading state
  if (isPending) {
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
                  Ngày đặt: {new Date(orderData.createdAt).toLocaleDateString('vi-VN')} {new Date(orderData.createdAt).toLocaleTimeString('vi-VN')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, sm: 0 }, flexWrap: 'wrap' }}>
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

          {/* Address Information */}
          {orderData.address && (
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
              <Typography variant='subtitle1' fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon fontSize='small' color='primary' />
                Địa Chỉ Giao Hàng
              </Typography>

              <Box sx={{ ml: 4 }}>
                <Typography variant='body1' fontWeight={500}>
                  {orderData.address.fullName}
                </Typography>
                <Typography variant='body2'>Số điện thoại: {orderData.address.phone}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  {orderData.address.street}, {orderData.address.ward}, {orderData.address.district}, {orderData.address.city}
                </Typography>
              </Box>
            </Paper>
          )}

          {/* Payment Information */}
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
                orderData.items.map((item: OrderItem) => {
                  const itemReview = findReviewForItem(item)
                  const showReviewForm = reviewForm && reviewForm.orderItemId === item.id

                  return (
                    <Box key={item.id}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
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
                          <Typography variant='subtitle2'>{item.productName || `Sản phẩm ${item.product.name}`}</Typography>
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

                      {/* Review section */}
                      {orderData.orderStatus === OrderStatus.DELIVERED && (
                        <Box sx={{ mt: 2, ml: { xs: 0, sm: 12 } }}>
                          {itemReview ? (
                            <Box
                              sx={{
                                p: 2,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider'
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <RateReviewIcon fontSize='small' color='primary' />
                                  <Typography variant='subtitle2'>Đánh giá của bạn</Typography>
                                </Box>
                                <Box>
                                  <IconButton size='small' onClick={() => handleEditReview(itemReview)}>
                                    <EditIcon fontSize='small' />
                                  </IconButton>
                                  <IconButton size='small' onClick={() => handleDeleteReview(itemReview.id)}>
                                    <DeleteIcon fontSize='small' />
                                  </IconButton>
                                </Box>
                              </Box>

                              <Rating value={itemReview.rating} readOnly precision={1} emptyIcon={<StarBorderIcon fontSize='inherit' />} icon={<StarIcon fontSize='inherit' />} />

                              <Typography variant='body2' sx={{ mt: 1 }}>
                                {itemReview.content}
                              </Typography>

                              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
                                Đánh giá vào: {new Date(itemReview.createdAt).toLocaleDateString('vi-VN')}
                              </Typography>
                            </Box>
                          ) : showReviewForm ? (
                            <Box
                              sx={{
                                p: 2,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider'
                              }}
                            >
                              <Typography variant='subtitle2' sx={{ mb: 1 }}>
                                {isEditMode ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá của bạn'}
                              </Typography>

                              <Rating
                                value={reviewForm.rating}
                                onChange={(_, newValue) => {
                                  setReviewForm(prev => ({ ...prev!, rating: newValue || 1 }))
                                }}
                                precision={1}
                                emptyIcon={<StarBorderIcon fontSize='inherit' />}
                                icon={<StarIcon fontSize='inherit' />}
                              />

                              <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder='Nhập nội dung đánh giá của bạn'
                                value={reviewForm.content}
                                onChange={e => setReviewForm(prev => ({ ...prev!, content: e.target.value }))}
                                size='small'
                                margin='normal'
                              />

                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                                <Button variant='outlined' size='small' onClick={handleCancelReview}>
                                  Hủy
                                </Button>
                                <Button variant='contained' size='small' onClick={handleSubmitReview} disabled={!reviewForm.content || isCreatingReview || isUpdatingReview}>
                                  {isEditMode ? 'Cập nhật' : 'Gửi đánh giá'}
                                </Button>
                              </Box>
                            </Box>
                          ) : (
                            <Button variant='outlined' size='small' startIcon={<RateReviewIcon />} onClick={() => handleOpenReviewForm(item)} sx={{ mt: 1 }}>
                              Viết đánh giá
                            </Button>
                          )}
                        </Box>
                      )}
                    </Box>
                  )
                })
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
              Quay Lại
            </Button>
            {needsPayment(orderData) && orderData.orderStatus === OrderStatus.PROCESSING && (
              <Button
                variant='contained'
                startIcon={<PaymentIcon />}
                onClick={handlePayAgain}
                sx={{
                  'bgcolor': '#ffa726',
                  '&:hover': {
                    bgcolor: '#f57c00'
                  }
                }}
              >
                Thanh Toán Ngay
              </Button>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
