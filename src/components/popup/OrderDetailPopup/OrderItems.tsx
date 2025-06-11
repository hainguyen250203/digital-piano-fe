'use client'

import ReviewForm from '@/components/popup/OrderDetailPopup/ReviewForm'
import ReviewItem from '@/components/popup/OrderDetailPopup/ReviewItem'
import { useFetchCreateReview, useFetchDeleteReview, useFetchUpdateReview } from '@/hooks/apis/review'
import { BaseResponse } from '@/types/base-response'
import { OrderItem, OrderStatus, ProductReview, ResponseOrder } from '@/types/order.type'
import { formatNumber } from '@/utils/order'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'
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

            return (
              <Box key={item.id}>
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
                        Đơn giá: {formatNumber(item.price)} VNĐ
                      </Typography>
                    </Box>
                    <Typography variant='subtitle2' color='primary.main'>
                      Thành tiền: {formatNumber(item.price * item.quantity)} VNĐ
                    </Typography>
                  </Box>
                </Box>

                {/* Review section - only show for delivered orders */}
                {orderData.orderStatus === OrderStatus.DELIVERED && (
                  <Box sx={{ mt: 2, ml: { xs: 0, sm: 12 } }}>
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
  )
})
