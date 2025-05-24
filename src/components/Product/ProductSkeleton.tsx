import { Box, Grid, Skeleton } from '@mui/material'

export default function ProductSkeleton({ count = 8 }) {
  return (
    <Grid container spacing={2}>
      {Array.from(new Array(count)).map((_, index) => (
        <Grid key={index} size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
          <Box sx={{ p: 2, height: '100%' }}>
            {/* Product image */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              sx={{ borderRadius: 2, mb: 1 }}
            />
            
            {/* Product title */}
            <Skeleton variant="text" width="80%" height={24} sx={{ mb: 0.5 }} />
            
            {/* Product price */}
            <Skeleton variant="text" width="50%" height={24} sx={{ mb: 0.5 }} />
            
            {/* Rating */}
            <Skeleton variant="text" width="40%" height={24} />
          </Box>
        </Grid>
      ))}
    </Grid>
  )
} 