'use client'

import { ProductReview } from '@/types/order.type'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import RateReviewIcon from '@mui/icons-material/RateReview'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { Box, IconButton, Rating, Typography } from '@mui/material'
import { memo } from 'react'

interface ReviewItemProps {
  review: ProductReview
  onEdit: () => void
  onDelete: () => void
  isDeleting: boolean
}

// Use React.memo to prevent unnecessary re-renders
export default memo(function ReviewItem({ review, onEdit, onDelete, isDeleting }: ReviewItemProps) {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'background.default',
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
          <IconButton size='small' onClick={onEdit} disabled={isDeleting}>
            <EditIcon fontSize='small' />
          </IconButton>
          <IconButton size='small' onClick={onDelete} disabled={isDeleting}>
            <DeleteIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>

      <Rating value={review.rating} readOnly precision={1} emptyIcon={<StarBorderIcon fontSize='inherit' />} icon={<StarIcon fontSize='inherit' />} />

      <Typography variant='body2' sx={{ mt: 1 }}>
        {review.content}
      </Typography>

      <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
        Đánh giá vào: {new Date(review.createdAt).toLocaleDateString('vi-VN')}
      </Typography>
    </Box>
  )
})
