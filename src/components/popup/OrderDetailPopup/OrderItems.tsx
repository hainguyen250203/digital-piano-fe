'use client'

import ReviewForm from '@/components/popup/OrderDetailPopup/ReviewForm'
import ReviewItem from '@/components/popup/OrderDetailPopup/ReviewItem'
import { useFetchCreateProductReturn } from '@/hooks/apis/product-return'
import { useFetchCreateReview, useFetchDeleteReview, useFetchUpdateReview } from '@/hooks/apis/review'
import { BaseResponse } from '@/types/base-response'
import { OrderItem, OrderStatus, ProductReview, ResponseOrder } from '@/types/order.type'
import { formatCurrency } from '@/utils/format'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Stack, TextField, Typography } from '@mui/material'
import { UseMutateFunction } from '@tanstack/react-query'
import Image from 'next/image'
import { memo, useCallback, useState } from 'react'
import { toast } from 'react-toastify'

interface OrderItemsProps {
  orderData: ResponseOrder
  refreshOrder: UseMutateFunction<BaseResponse<ResponseOrder>, BaseResponse<null>, string, unknown>
}

interface ReviewFormData {
  id?: string
  orderItemId: string
  productId: string
  rating: number
  content: string
}

// Use React.memo to prevent unnecessary re-renders
export default memo(function OrderItems({ orderData, refreshOrder }: OrderItemsProps) {
  const [reviewForm, setReviewForm] = useState<ReviewFormData | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [returnForm, setReturnForm] = useState<{ open: boolean; orderItemId: string; quantity: number; reason: string } | null>(null)

  // Create review mutation
  const { mutate: createReview, isPending: isCreatingReview } = useFetchCreateReview(orderData.id, {
    onSuccess: () => {
      toast.success('Đánh giá đã được gửi thành công')
      setReviewForm(null)
      setTimeout(() => refreshOrder(orderData.id), 500)
    },
    onError: error => {
      toast.error(error?.message || 'Gửi đánh giá thất bại')
    }
  })

  // Update review mutation
  const { mutate: updateReview, isPending: isUpdatingReview } = useFetchUpdateReview(orderData.id, {
    onSuccess: () => {
      toast.success('Đánh giá đã được cập nhật thành công')
      setReviewForm(null)
      setIsEditMode(false)
    },
    onError: error => {
      toast.error(error?.message || 'Cập nhật đánh giá thất bại')
    }
  })

  // Delete review mutation
  const { mutate: deleteReview, isPending: isDeletingReview } = useFetchDeleteReview(orderData.id, {
    onSuccess: () => {
      toast.success('Đã xóa đánh giá thành công')
      setTimeout(() => refreshOrder(orderData.id), 500)
    },
    onError: error => {
      toast.error(error?.message || 'Xóa đánh giá thất bại')
    }
  })

  // Create product return mutation
  const { mutate: createReturn, isPending: isCreatingReturn } = useFetchCreateProductReturn(orderData.id, {
    onSuccess: () => {
      toast.success('Yêu cầu trả hàng đã được gửi')
      setReturnForm(null)
      setTimeout(() => refreshOrder(orderData.id), 500)
    },
    onError: error => {
      toast.error(error?.message || 'Gửi yêu cầu trả hàng thất bại')
    }
  })

  const handleOpenReviewForm = useCallback((item: OrderItem) => {
    setReviewForm({
      orderItemId: item.id,
      productId: item.productId,
      rating: 5,
      content: ''
    })
    setIsEditMode(false)
  }, [])

  const handleEditReview = useCallback((review: ProductReview) => {
    setReviewForm({
      id: review.id,
      orderItemId: review.orderItemId,
      productId: review.productId,
      rating: review.rating,
      content: review.content
    })
    setIsEditMode(true)
  }, [])

  const handleDeleteReview = useCallback(
    (reviewId: string) => {
      if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
        deleteReview({ id: reviewId })
      }
    },
    [deleteReview]
  )

  const handleSubmitReview = useCallback(() => {
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
  }, [reviewForm, isEditMode, updateReview, createReview])

  const handleCancelReview = useCallback(() => {
    setReviewForm(null)
    setIsEditMode(false)
  }, [])

  const handleRatingChange = useCallback(
    (newValue: number | null) => {
      if (reviewForm) {
        setReviewForm(prev => ({ ...prev!, rating: newValue || 1 }))
      }
    },
    [reviewForm]
  )

  const handleContentChange = useCallback(
    (content: string) => {
      if (reviewForm) {
        setReviewForm(prev => ({ ...prev!, content }))
      }
    },
    [reviewForm]
  )

  const findReviewForItem = useCallback((item: OrderItem) => {
    if (!item.product?.reviews || !Array.isArray(item.product.reviews)) return null
    return item.product.reviews[0] || null
  }, [])

  const shouldShowReviewForm = useCallback(
    (itemId: string) => {
      return Boolean(reviewForm && reviewForm.orderItemId === itemId)
    },
    [reviewForm]
  )

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
        <ShoppingBagIcon fontSize='small' color='primary' />
        Sản Phẩm Đã Đặt
      </Typography>

      <Stack spacing={2} divider={<Divider flexItem />}>
        {Array.isArray(orderData.items) && orderData.items.length > 0 ? (
          orderData.items.map((item: OrderItem) => {
            const itemReview = findReviewForItem(item)
            const isEditing = isEditMode && reviewForm?.orderItemId === item.id
            const isReturned = Array.isArray(item.productReturns) && item.productReturns.length > 0

            return (
              <Box key={item.id} sx={isReturned ? { border: '2px solid', borderColor: 'warning.main', borderRadius: 2, bgcolor: 'rgba(255, 193, 7, 0.08)' } : {}}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Box
                    sx={{
                      width: { xs: '100%', sm: 80 },
                      height: { xs: 120, sm: 80 },
                      position: 'relative',
                      borderRadius: 1,
                      overflow: 'hidden',
                      flexShrink: 0,
                      alignSelf: { xs: 'center', sm: 'flex-start' }
                    }}
                  >
                    {item.product?.defaultImage?.url ? (
                      <Image src={item.product.defaultImage.url} alt={item.productName || 'Sản phẩm'} layout='fill' objectFit='cover' />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant='caption'>Không có ảnh</Typography>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant='subtitle2' fontWeight={600} gutterBottom noWrap>
                      {item.product?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 2 }, mb: 1 }}>
                      <Typography variant='body2' color='text.secondary'>
                        Số lượng: {item.quantity}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Đơn giá: {formatCurrency(item.price)}
                      </Typography>
                    </Box>
                    <Typography variant='subtitle2' color='primary.main'>
                      Thành tiền: {formatCurrency(item.price * item.quantity)}
                    </Typography>
                  </Box>
                </Box>

                {/* Return action button */}
                {isReturned ? (
                  <Chip label='Đã trả hàng' color='warning' size='small' sx={{ mt: 1 }} />
                ) : (
                  <Button variant='outlined' size='small' sx={{ mt: 1 }} onClick={() => setReturnForm({ open: true, orderItemId: item.id, quantity: 1, reason: '' })}>
                    Trả hàng
                  </Button>
                )}

                {/* Review section - only show for delivered orders */}
                {orderData.orderStatus === OrderStatus.DELIVERED && (
                  <Box sx={{ mt: 2, ml: { xs: 0, sm: 12 } }}>
                    {!isReturned && (
                      <>
                        {isEditing || shouldShowReviewForm(item.id) ? (
                          <ReviewForm
                            reviewForm={reviewForm}
                            isEditMode={isEditMode}
                            isCreatingReview={isCreatingReview}
                            isUpdatingReview={isUpdatingReview}
                            onRatingChange={handleRatingChange}
                            onContentChange={handleContentChange}
                            onCancel={handleCancelReview}
                            onSubmit={handleSubmitReview}
                          />
                        ) : itemReview ? (
                          <ReviewItem review={itemReview} onEdit={() => handleEditReview(itemReview)} onDelete={() => handleDeleteReview(itemReview.id)} isDeleting={isDeletingReview} />
                        ) : (
                          <Button variant='outlined' size='small' startIcon={<RateReviewIcon />} onClick={() => handleOpenReviewForm(item)} sx={{ mt: 1 }}>
                            Viết đánh giá
                          </Button>
                        )}
                      </>
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

      {/* Return Form Dialog */}
      <Dialog open={!!returnForm} onClose={() => setReturnForm(null)}>
        <DialogTitle>Yêu cầu trả hàng</DialogTitle>
        <DialogContent>
          <TextField
            label='Số lượng trả'
            type='number'
            fullWidth
            margin='normal'
            inputProps={{ min: 1, max: orderData.items.find(i => i.id === returnForm?.orderItemId)?.quantity || 1 }}
            value={returnForm?.quantity || 1}
            onChange={e => setReturnForm(f => (f ? { ...f, quantity: Math.max(1, Math.min(Number(e.target.value), orderData.items.find(i => i.id === f.orderItemId)?.quantity || 1)) } : f))}
          />
          <TextField
            label='Lý do trả hàng'
            fullWidth
            margin='normal'
            multiline
            minRows={2}
            value={returnForm?.reason || ''}
            onChange={e => setReturnForm(f => (f ? { ...f, reason: e.target.value } : f))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnForm(null)} disabled={isCreatingReturn}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (returnForm) {
                createReturn({
                  orderItemId: returnForm.orderItemId,
                  quantity: returnForm.quantity,
                  reason: returnForm.reason
                })
              }
            }}
            disabled={isCreatingReturn || !returnForm?.reason || !returnForm?.quantity}
            variant='contained'
          >
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
})
