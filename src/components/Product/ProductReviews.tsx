import { Comment, Person, Star, StarBorder, StarHalf } from '@mui/icons-material'
import { Box, Button, Chip, Grid, Paper, Typography, alpha, useMediaQuery, useTheme } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import Image from 'next/image'
import { useState } from 'react'

interface ReviewUser {
  id: string
  email: string
  avatarUrl: string | null | undefined
}

interface Review {
  id: string
  content: string
  rating: number
  createdAt: string
  user: ReviewUser
}

interface ProductReviewsProps {
  reviews: Review[]
}

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Reviews state
  const [reviewsSort, setReviewsSort] = useState<'newest' | 'highest' | 'lowest'>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 3

  // Sort and paginate reviews
  const getSortedReviews = () => {
    if (!reviews) return []

    let sorted = [...reviews]

    switch (reviewsSort) {
      case 'newest':
        sorted = sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'highest':
        sorted = sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'lowest':
        sorted = sorted.sort((a, b) => a.rating - b.rating)
        break
    }

    return sorted
  }

  const sortedReviews = getSortedReviews()
  const totalPages = Math.ceil((sortedReviews?.length || 0) / reviewsPerPage)
  const paginatedReviews = sortedReviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Render star rating
  const renderRating = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const starSize = isMobile ? 'small' : 'medium'

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} fontSize={starSize} sx={{ color: theme.palette.warning.main }} />)
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key='half' fontSize={starSize} sx={{ color: theme.palette.warning.main }} />)
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarBorder key={`empty-${i}`} fontSize={starSize} sx={{ color: theme.palette.warning.main }} />)
    }

    return stars
  }

  // Format date to relative time
  const formatReviewDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi })
    } catch {
      return dateString
    }
  }

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0
    return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  }

  // Count ratings per star level
  const getRatingCounts = () => {
    if (!reviews) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach(review => {
      const rating = Math.floor(review.rating)
      if (counts[rating as keyof typeof counts] !== undefined) {
        counts[rating as keyof typeof counts]++
      }
    })

    return counts
  }

  const averageRating = calculateAverageRating()
  const ratingCounts = getRatingCounts()

  return (
    <Box sx={{ mb: 6 }}>
      {/* Section Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: '#0000001f'
        }}
      >
        <Typography variant='h5' fontWeight={700} color='primary.main' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Comment /> Đánh giá sản phẩm
        </Typography>
        {reviews?.length > 0 && <Chip label={`${reviews.length} đánh giá`} size='small' sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 500 }} />}
      </Box>

      {/* Reviews Content */}
      {reviews && reviews.length > 0 ? (
        <Grid container spacing={4} alignItems='flex-start'>
          {/* Left Column: Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: '#0000001f',
                height: '100%'
              }}
            >
              {/* Average Rating */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  pb: 3,
                  mb: 3,
                  borderBottom: '1px solid',
                  borderColor: '#0000001f'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                  <Typography variant='h3' fontWeight={700} color='primary.main' sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>
                    {averageRating.toFixed(1)}
                  </Typography>
                  <Typography component='span' variant='h6' color='text.secondary' sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    /5
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', mb: 1 }}>{renderRating(averageRating)}</Box>
                <Typography variant='body2' color='text.secondary'>
                  {reviews.length} đánh giá từ khách hàng
                </Typography>
              </Box>

              {/* Rating Distribution */}
              <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 2, color: theme.palette.text.primary }}>
                Phân bố đánh giá
              </Typography>
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingCounts[rating as keyof typeof ratingCounts]
                const percentage = (count / reviews.length) * 100

                return (
                  <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 32 }}>
                      <Typography variant='body2'>{rating}</Typography>
                      <Star sx={{ fontSize: 16, color: theme.palette.warning.main, ml: 0.5 }} />
                    </Box>
                    <Box sx={{ flexGrow: 1, mx: 1 }}>
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: alpha(theme.palette.warning.main, 0.2),
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            width: `${percentage}%`,
                            height: '100%',
                            bgcolor: theme.palette.warning.main,
                            borderRadius: 4,
                            minWidth: '4px'
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant='body2' color='text.secondary' sx={{ minWidth: 30, textAlign: 'right' }}>
                      {count}
                    </Typography>
                  </Box>
                )
              })}
            </Paper>
          </Grid>

          {/* Right Column: Reviews List */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Sorting Options */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Typography variant='subtitle1' fontWeight={600} color='text.primary'>
                Tất cả đánh giá
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size='small'
                  variant={reviewsSort === 'newest' ? 'contained' : 'outlined'}
                  onClick={() => setReviewsSort('newest')}
                  sx={{
                    borderRadius: 8,
                    px: 2,
                    minWidth: 0,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none'
                  }}
                >
                  Mới nhất
                </Button>
                <Button
                  size='small'
                  variant={reviewsSort === 'highest' ? 'contained' : 'outlined'}
                  onClick={() => setReviewsSort('highest')}
                  sx={{
                    borderRadius: 8,
                    px: 2,
                    minWidth: 0,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none'
                  }}
                >
                  Đánh giá cao
                </Button>
                <Button
                  size='small'
                  variant={reviewsSort === 'lowest' ? 'contained' : 'outlined'}
                  onClick={() => setReviewsSort('lowest')}
                  sx={{
                    borderRadius: 8,
                    px: 2,
                    minWidth: 0,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none'
                  }}
                >
                  Đánh giá thấp
                </Button>
              </Box>
            </Box>

            {/* Reviews List */}
            <Box>
              {paginatedReviews.map(review => (
                <Paper
                  key={review.id}
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: '#0000001f',
                    transition: 'transform 0.1s ease-in-out'
                  }}
                >
                  {/* Review Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 0 }
                    }}
                  >
                    {/* User Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {/* User Avatar */}
                      {review.user.avatarUrl ? (
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            mr: 2,
                            border: '1px solid',
                            borderColor: '#0000001f',
                            position: 'relative',
                            flexShrink: 0
                          }}
                        >
                          <Image src={review.user.avatarUrl} alt={review.user.email} fill style={{ objectFit: 'cover' }} />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            flexShrink: 0
                          }}
                        >
                          <Person fontSize='small' />
                        </Box>
                      )}

                      {/* User Details */}
                      <Box>
                        <Typography
                          variant='subtitle2'
                          fontWeight={600}
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: { xs: '200px', sm: '100%' }
                          }}
                        >
                          {review.user.email}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {formatReviewDate(review.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Rating Stars */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: alpha(theme.palette.warning.light, 0.1),
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 8,
                        alignSelf: { xs: 'flex-start', sm: 'center' },
                        border: '1px solid',
                        borderColor: alpha(theme.palette.warning.main, 0.2)
                      }}
                    >
                      {renderRating(review.rating)}
                    </Box>
                  </Box>

                  {/* Review Content */}
                  <Typography
                    variant='body1'
                    sx={{
                      lineHeight: 1.7,
                      fontStyle: 'italic',
                      color: alpha(theme.palette.text.primary, 0.9),
                      textAlign: 'left'
                    }}
                  >
                    &ldquo;{review.content}&rdquo;
                  </Typography>
                </Paper>
              ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  mt: 4
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1
                  }}
                >
                  {/* Previous Page Button */}
                  <Button
                    size='small'
                    variant='outlined'
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    sx={{
                      minWidth: 36,
                      width: 36,
                      height: 36,
                      p: 0,
                      borderRadius: 2,
                      color: currentPage !== 1 ? 'primary.main' : 'text.disabled'
                    }}
                  >
                    &laquo;
                  </Button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      size='small'
                      variant={currentPage === page ? 'contained' : 'outlined'}
                      onClick={() => handlePageChange(page)}
                      sx={{
                        minWidth: 36,
                        width: 36,
                        height: 36,
                        p: 0,
                        borderRadius: 2,
                        boxShadow: currentPage === page ? 1 : 0
                      }}
                    >
                      {page}
                    </Button>
                  ))}

                  {/* Next Page Button */}
                  <Button
                    size='small'
                    variant='outlined'
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    sx={{
                      minWidth: 36,
                      width: 36,
                      height: 36,
                      p: 0,
                      borderRadius: 2,
                      color: currentPage !== totalPages ? 'primary.main' : 'text.disabled'
                    }}
                  >
                    &raquo;
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', height: '100%' }}>
          <Typography variant='h6' color='text.secondary'>
            Chưa có đánh giá nào
          </Typography>
        </Box>
      )}
    </Box>
  )
}
