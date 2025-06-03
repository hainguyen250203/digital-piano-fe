'use client'

import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { Box, Button, Rating, TextField, Typography } from '@mui/material'
import { memo } from 'react'
import { useReview } from './ReviewContext'

// Use React.memo to prevent unnecessary re-renders
export default memo(function ReviewForm() {
  const { 
    reviewForm, 
    isEditMode, 
    handleRatingChange, 
    handleContentChange, 
    handleCancelReview, 
    handleSubmitReview,
    isCreatingReview,
    isUpdatingReview
  } = useReview()

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

      <Rating
        value={reviewForm?.rating || 5}
        onChange={(_, newValue) => handleRatingChange(newValue)}
        precision={1}
        emptyIcon={<StarBorderIcon fontSize='inherit' />}
        icon={<StarIcon fontSize='inherit' />}
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder='Nhập nội dung đánh giá của bạn'
        value={reviewForm?.content || ''}
        onChange={e => handleContentChange(e.target.value)}
        size='small'
        margin='normal'
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
        <Button variant='outlined' size='small' onClick={handleCancelReview}>
          Hủy
        </Button>
        <Button 
          variant='contained' 
          size='small' 
          onClick={handleSubmitReview} 
          disabled={!reviewForm || !reviewForm.content || isCreatingReview || isUpdatingReview}
        >
          {isEditMode ? 'Cập nhật' : 'Gửi đánh giá'}
        </Button>
      </Box>
    </Box>
  )
}) 