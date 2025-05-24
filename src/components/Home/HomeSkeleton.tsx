import { Box, Container, Grid, Skeleton, useMediaQuery, useTheme } from '@mui/material'

export default function HomeSkeleton() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  
  // Calculate how many products to show based on viewport
  const visibleProducts = isMobile ? 4 : isTablet ? 4 : 8
  
  return (
    <Container maxWidth="xl">
      {/* Section headers and products - repeated for multiple sections */}
      {[1, 2].map((section) => (
        <Box key={section} sx={{ mb: { xs: 6, md: 8 } }}>
          {/* Section header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              mb: { xs: 2, md: 3 },
              gap: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto' }}>
              <Skeleton
                variant="circular"
                width={isMobile ? 32 : 40}
                height={isMobile ? 32 : 40}
                sx={{ mr: 1.5 }}
              />
              <Skeleton
                variant="text"
                width={180}
                height={isMobile ? 28 : 36}
              />
            </Box>
            <Skeleton
              variant="rectangular"
              width={120}
              height={36}
              sx={{ borderRadius: 1, ml: { xs: 0, sm: 'auto' }, minWidth: { xs: '100%', sm: 'auto' } }}
            />
          </Box>

          {/* Product grid */}
          <Grid container spacing={2}>
            {Array.from(new Array(visibleProducts)).map((_, index) => (
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
        </Box>
      ))}
    </Container>
  )
} 