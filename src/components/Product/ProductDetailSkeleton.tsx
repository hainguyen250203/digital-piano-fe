import { Box, Container, Divider, Grid, Skeleton } from '@mui/material'

export default function ProductDetailSkeleton() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={300} height={24} />
      </Box>

      <Grid container spacing={4}>
        {/* Left column - Product images */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 2 }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={400}
              sx={{ borderRadius: 2 }}
            />
          </Box>

          {/* Thumbnails */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                variant="rectangular"
                width={80}
                height={80}
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        </Grid>

        {/* Right column - Product information */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Title and brand */}
          <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="rectangular" width={120} height={24} sx={{ borderRadius: 4, mr: 1 }} />
            <Skeleton variant="text" width={80} height={24} />
          </Box>

          {/* Price */}
          <Skeleton variant="text" width="40%" height={36} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />

          <Divider sx={{ my: 2 }} />

          {/* Description */}
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="95%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="85%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} />
          </Box>

          {/* Options */}
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} variant="rectangular" width={60} height={36} sx={{ borderRadius: 1 }} />
              ))}
            </Box>
          </Box>

          {/* Quantity selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Skeleton variant="text" width={100} height={24} sx={{ mr: 2 }} />
            <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
          </Box>

          {/* Add to cart and buy buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Skeleton variant="rectangular" width="50%" height={48} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="50%" height={48} sx={{ borderRadius: 1 }} />
          </Box>

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} variant="rectangular" width={80} height={30} sx={{ borderRadius: 4 }} />
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Product details and specifications */}
      <Box sx={{ mt: 6 }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} width="100%" sx={{ borderRadius: 2, mb: 4 }} />

        {/* Reviews */}
        <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
        {[1, 2].map((review) => (
          <Box key={review} sx={{ mb: 3, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
                <Skeleton variant="text" width={120} height={24} />
              </Box>
              <Skeleton variant="text" width={80} height={24} />
            </Box>
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} />
          </Box>
        ))}
      </Box>

      {/* Related products */}
      <Box sx={{ mt: 6 }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <Grid key={item} size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
              <Box sx={{ p: 2 }}>
                <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 2, mb: 1 }} />
                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="50%" height={24} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
} 