'use client'

import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { Box, Button, Rating, TextField, Typography } from '@mui/material'
import { memo } from 'react'

interface ReviewFormProps {
  reviewForm: {
    rating: number
    content: string
  } | null
  isEditMode: boolean
  isCreatingReview: boolean
  isUpdatingReview: boolean
  onRatingChange: (value: number | null) => void
  onContentChange: (content: string) => void
  onCancel: () => void
  onSubmit: () => void
}

// Use React.memo to prevent unnecessary re-renders
export default memo(function ReviewForm({ reviewForm, isEditMode, isCreatingReview, isUpdatingReview, onRatingChange, onContentChange, onCancel, onSubmit }: ReviewFormProps) {
  if (!reviewForm) return null

  return (
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

      <Rating value={reviewForm.rating} onChange={(_, newValue) => onRatingChange(newValue)} precision={1} emptyIcon={<StarBorderIcon fontSize='inherit' />} icon={<StarIcon fontSize='inherit' />} />

      <TextField fullWidth multiline rows={3} placeholder='Nhập nội dung đánh giá của bạn' value={reviewForm.content} onChange={e => onContentChange(e.target.value)} size='small' margin='normal' />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
        <Button variant='outlined' size='small' onClick={onCancel}>
          Hủy
        </Button>
        <Button variant='contained' size='small' onClick={onSubmit} disabled={!reviewForm.content || isCreatingReview || isUpdatingReview}>
          {isEditMode ? 'Cập nhật' : 'Gửi đánh giá'}
        </Button>
      </Box>
    </Box>
  )
})
