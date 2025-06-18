import { useFetchDeleteReviewAdmin, useFetchUpdateReviewAdmin } from '@/hooks/apis/review'
import { ProductDetailData } from '@/types/product.type'
import { EditReviewPayload } from '@/types/review.type'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import StarIcon from '@mui/icons-material/Star'
import { Avatar, Box, Chip, IconButton, Paper, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import { memo, useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

interface ProductReviewsListProps {
  product: ProductDetailData
}

export default memo(function ProductReviewsList({ product }: ProductReviewsListProps) {
  const [hoveredReviewId, setHoveredReviewId] = useState<string | null>(null)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{ rating: number; content: string }>({ rating: 0, content: '' })

  // Admin hooks
  const { mutate: updateReview, isPending: isUpdatePending } = useFetchUpdateReviewAdmin(product.id, {
    onSuccess: () => {
      toast.success('Cập nhật đánh giá thành công!')
      setEditingReviewId(null)
      setEditForm({ rating: 0, content: '' })
    },
    onError: error => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật đánh giá')
    }
  })

  const { mutate: deleteReview, isPending: isDeletePending } = useFetchDeleteReviewAdmin(product.id, {
    onSuccess: () => {
      toast.success('Xóa đánh giá thành công!')
    },
    onError: error => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa đánh giá')
    }
  })

  const handleEditReview = useCallback(
    (reviewId: string) => {
      const review = product.reviews.find(r => r.id === reviewId)
      if (review) {
        setEditingReviewId(reviewId)
        setEditForm({ rating: review.rating, content: review.content })
      }
    },
    [product.reviews]
  )

  const handleSaveEdit = useCallback(() => {
    if (!editingReviewId) return

    const payload: EditReviewPayload = {
      id: editingReviewId,
      rating: editForm.rating,
      content: editForm.content
    }

    updateReview(payload)
  }, [editingReviewId, editForm.rating, editForm.content, updateReview])

  const handleCancelEdit = useCallback(() => {
    setEditingReviewId(null)
    setEditForm({ rating: 0, content: '' })
  }, [])

  const handleDeleteReview = useCallback(
    (reviewId: string) => {
      deleteReview({ id: reviewId })
    },
    [deleteReview]
  )

  const handleRatingChange = useCallback((newValue: number | null) => {
    setEditForm(prev => ({ ...prev, rating: newValue || 0 }))
  }, [])

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({ ...prev, content: e.target.value }))
  }, [])

  const handleMouseEnter = useCallback((reviewId: string) => {
    setHoveredReviewId(reviewId)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredReviewId(null)
  }, [])

  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        sx={{
          fontSize: 16,
          color: index < rating ? '#ffc107' : '#e0e0e0'
        }}
      />
    ))
  }, [])

  const getRatingColor = useCallback((rating: number) => {
    if (rating >= 4) return 'success'
    if (rating >= 3) return 'warning'
    return 'error'
  }, [])

  const getRatingText = useCallback((rating: number) => {
    if (rating >= 4.5) return 'Tuyệt vời'
    if (rating >= 4) return 'Rất tốt'
    if (rating >= 3.5) return 'Tốt'
    if (rating >= 3) return 'Khá'
    if (rating >= 2) return 'Trung bình'
    return 'Kém'
  }, [])

  // Memoize calculations
  const averageRating = useMemo(() => {
    if (!product.reviews || product.reviews.length === 0) return 0
    return product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
  }, [product.reviews])

  const hasReviews = useMemo(() => {
    return product.reviews && product.reviews.length > 0
  }, [product.reviews])

  // Memoize reviews array để tránh re-render không cần thiết
  const reviewsArray = useMemo(() => {
    return product.reviews || []
  }, [product.reviews])

  if (!hasReviews) {
    return (
      <Paper elevation={2} style={{ padding: 24, borderRadius: 8 }}>
        <Typography variant='h6' mb={2} fontWeight='bold' color='primary.main' pb={1} style={{ borderBottom: '1px solid #e0e0e0' }}>
          Đánh giá sản phẩm
        </Typography>
        <Box display='flex' justifyContent='center' alignItems='center' py={4}>
          <Typography variant='body1' color='text.secondary'>
            Chưa có đánh giá nào cho sản phẩm này
          </Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Paper elevation={2} style={{ padding: 24, borderRadius: 8 }}>
      <Typography variant='h6' mb={3} fontWeight='bold' color='primary.main' pb={1} style={{ borderBottom: '1px solid #e0e0e0' }}>
        Đánh giá sản phẩm ({reviewsArray.length} đánh giá)
      </Typography>

      {/* Average Rating Summary */}
      <Box display='flex' alignItems='center' gap={2} mb={3} p={2} bgcolor='grey.50' borderRadius={1}>
        <Box display='flex' alignItems='center' gap={1}>
          <Typography variant='h4' fontWeight='bold' color='primary.main'>
            {averageRating.toFixed(1)}
          </Typography>
          <Box display='flex' alignItems='center'>
            {renderStars(Math.round(averageRating))}
          </Box>
        </Box>
        <Chip label={getRatingText(averageRating)} color={getRatingColor(averageRating) as 'success' | 'warning' | 'error'} size='small' variant='filled' />
        <Typography variant='body2' color='text.secondary'>
          Trung bình từ {reviewsArray.length} đánh giá
        </Typography>
      </Box>

      {/* Reviews Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Người đánh giá</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Ngày đánh giá</TableCell>
              <TableCell align='center'>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewsArray.map(review => {
              const isEditing = editingReviewId === review.id

              return (
                <TableRow
                  key={review.id}
                  hover
                  onMouseEnter={() => handleMouseEnter(review.id)}
                  onMouseLeave={handleMouseLeave}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <TableCell>
                    <Box display='flex' alignItems='center' gap={2}>
                      <Avatar src={review.user.avatarUrl || undefined} alt={review.user.email} sx={{ width: 40, height: 40 }}>
                        {!review.user.avatarUrl && review.user.email.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant='body2' fontWeight='medium'>
                          {review.user.email}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          ID: {review.user.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Rating value={editForm.rating} onChange={(_, newValue) => handleRatingChange(newValue)} size='small' />
                    ) : (
                      <Box display='flex' alignItems='center' gap={1}>
                        <Box display='flex' alignItems='center'>
                          {renderStars(review.rating)}
                        </Box>
                        <Chip label={getRatingText(review.rating)} color={getRatingColor(review.rating) as 'success' | 'warning' | 'error'} size='small' variant='outlined' />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <TextField value={editForm.content} onChange={handleContentChange} multiline rows={2} size='small' fullWidth variant='outlined' />
                    ) : (
                      <Typography
                        variant='body2'
                        sx={{
                          maxWidth: 300,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.4,
                          maxHeight: '4.2em' // 3 lines * 1.4 line-height
                        }}
                      >
                        {review.content}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.secondary'>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {new Date(review.createdAt).toLocaleTimeString('vi-VN')}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    {isEditing ? (
                      <Box display='flex' gap={1} justifyContent='center'>
                        <Tooltip title='Lưu'>
                          <IconButton
                            color='success'
                            size='small'
                            onClick={handleSaveEdit}
                            disabled={isUpdatePending}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(76, 175, 80, 0.1)'
                              }
                            }}
                          >
                            <SaveIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Hủy'>
                          <IconButton
                            color='default'
                            size='small'
                            onClick={handleCancelEdit}
                            disabled={isUpdatePending}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.1)'
                              }
                            }}
                          >
                            <CancelIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Box
                        display='flex'
                        gap={1}
                        justifyContent='center'
                        sx={{
                          opacity: hoveredReviewId === review.id ? 1 : 0.7,
                          transition: 'opacity 0.2s ease'
                        }}
                      >
                        <Tooltip title='Sửa đánh giá'>
                          <IconButton
                            color='primary'
                            size='small'
                            onClick={() => handleEditReview(review.id)}
                            disabled={isDeletePending}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.1)'
                              }
                            }}
                          >
                            <EditIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Xóa đánh giá'>
                          <IconButton
                            color='error'
                            size='small'
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={isDeletePending}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(211, 47, 47, 0.1)'
                              }
                            }}
                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
})
