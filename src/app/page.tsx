'use client'

import HomeBanner from '@/components/Home/HomeBanner'
import HomeSkeleton from '@/components/Home/HomeSkeleton'
import ProductList from '@/components/Product/ProductList'
import { useFetchProductFeatured, useFetchProductHotSale } from '@/hooks/apis/product'
import { ArrowForward, LocalMall, Star } from '@mui/icons-material'
import { alpha, Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link'

export default function HomePage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const { data: productHotSale, isLoading: productHotSaleLoading, error: productHotSaleError } = useFetchProductHotSale()
  const { data: productFeatured, isLoading: productFeaturedLoading, error: productFeaturedError } = useFetchProductFeatured()
  const visibleProducts = isMobile ? 4 : isTablet ? 4 : 8

  // Show skeleton while loading the entire page
  if (productHotSaleLoading && productFeaturedLoading) {
    return <HomeSkeleton />
  }

  const selectedProductHotSale = productHotSale?.slice(0, visibleProducts)
  const selectedProductFeatured = productFeatured?.slice(0, visibleProducts)

  return (
    <main>
      {/* Hero Banner */}
      <HomeBanner />
      
      {/* Hot Sale Section */}
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
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
            <Box
              sx={{
                width: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 },
                borderRadius: '50%',
                bgcolor: '#8c0034',
                mr: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LocalMall fontSize='small' sx={{ color: '#ffffff', fontSize: { xs: 16, md: 20 } }} />
            </Box>
            <Typography
              variant='h4'
              fontWeight={700}
              sx={{
                color: '#8c0034',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              Khuyến Mãi
            </Typography>
          </Box>
          <Button
            component={Link}
            href='/products?filter=hotsale'
            endIcon={<ArrowForward />}
            sx={{
              'fontWeight': 600,
              'color': '#8c0034',
              'textTransform': 'none',
              'ml': { xs: 0, sm: 'auto' },
              'minWidth': { xs: '100%', sm: 'auto' },
              'mt': { xs: 1, sm: 0 },
              'order': { xs: 2, sm: 1 },
              '&:hover': {
                backgroundColor: alpha('#8c0034', 0.1)
              }
            }}
          >
            Xem Tất Cả
          </Button>
        </Box>

        <ProductList 
          products={selectedProductHotSale} 
          isLoading={productHotSaleLoading} 
          error={productHotSaleError}
        />
      </Box>

      {/* Featured Section */}
      <Box sx={{ mb: { xs: 4, md: 8 } }}>
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
            <Box
              sx={{
                width: { xs: 32, md: 40 },
                height: { xs: 32, md: 40 },
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
                mr: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Star fontSize='small' sx={{ color: '#ffffff', fontSize: { xs: 16, md: 20 } }} />
            </Box>
            <Typography
              variant='h4'
              fontWeight={700}
              color='primary'
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              Sản Phẩm Nổi Bật
            </Typography>
          </Box>
          <Button
            component={Link}
            href='/products?filter=featured'
            endIcon={<ArrowForward />}
            sx={{
              'fontWeight': 600,
              'color': theme.palette.primary.main,
              'textTransform': 'none',
              'ml': { xs: 0, sm: 'auto' },
              'minWidth': { xs: '100%', sm: 'auto' },
              'mt': { xs: 1, sm: 0 },
              'order': { xs: 2, sm: 1 },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            Xem Tất Cả
          </Button>
        </Box>

        <ProductList 
          products={selectedProductFeatured}
          isLoading={productFeaturedLoading}
          error={productFeaturedError}
        />
      </Box>
    </main>
  )
}
