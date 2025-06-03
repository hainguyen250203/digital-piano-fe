'use client'

import { OrderItem, OrderStatus, ResponseOrder } from '@/types/order.type'
import { formatNumber } from '@/utils/order'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { memo, useEffect } from 'react'
import { useReview } from './ReviewContext'
import ReviewForm from './ReviewForm'
import ReviewItem from './ReviewItem'

interface OrderItemsProps {
  orderData: ResponseOrder
}

// Use React.memo to prevent unnecessary re-renders
export default memo(function OrderItems({ orderData }: OrderItemsProps) {
  const { findReviewForItem, shouldShowReviewForm, handleOpenReviewForm, updateLocalReviews, reviewForm, isEditMode } = useReview()

  // Update local reviews when order data changes
  useEffect(() => {
    if (orderData?.items && Array.isArray(orderData.items)) {
      updateLocalReviews(orderData.items)
    }
  }, [orderData?.items, updateLocalReviews])

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
                      <ReviewForm />
                    ) : itemReview ? (
                      <ReviewItem review={itemReview} />
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
