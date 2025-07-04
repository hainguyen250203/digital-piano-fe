'use client'

import ProductDescription from '@/components/Product/ProductDescription'
import ProductDetailSkeleton from '@/components/Product/ProductDetailSkeleton'
import ProductGallery from '@/components/Product/ProductGallery'
import ProductInfo from '@/components/Product/ProductInfo'
import ProductList from '@/components/Product/ProductList'
import ProductReviews from '@/components/Product/ProductReviews'
import { useFetchAddToCart } from '@/hooks/apis/cart'
import { useFetchProductDetail, useFetchProductRelated } from '@/hooks/apis/product'
import { useAddToWishlist, useDeleteFromWishlistByProduct, useFetchWishlist } from '@/hooks/apis/wishlist'
import { isAuthenticated } from '@/utils/auth'
import { NavigateNext, Widgets } from '@mui/icons-material'
import { Box, Breadcrumbs, Grid, Link, Typography } from '@mui/material'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

function ProductDetailContent({ productId }: { productId: string }) {
  const isLoggedIn = isAuthenticated()
  // Fetch product data
  const { data: productData, isLoading, error } = useFetchProductDetail(productId)
  const { data: relatedProducts } = useFetchProductRelated(productId)

  // Cart and wishlist hooks
  const { mutate: addToCart, isPending: isAddingToCart } = useFetchAddToCart()
  const { data: wishlistData } = useFetchWishlist()
  const { mutate: addToWishlist, isPending: isAddingToWishlist } = useAddToWishlist()
  const { mutate: removeFromWishlist } = useDeleteFromWishlistByProduct()

  const product = productData?.data
  const isProductInWishlist = isLoggedIn ? wishlistData?.data?.some(item => item.productId === productId) || false : false

  const handleAddToFavorites = () => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này')
      return
    }

    if (isProductInWishlist) {
      removeFromWishlist(productId, {
        onError: () => {
          toast.error('Không thể xóa khỏi danh sách yêu thích')
        }
      })
    } else {
      addToWishlist(productId, {
        onError: () => {
          toast.error('Không thể thêm vào danh sách yêu thích')
        }
      })
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        { productId },
        {
          onSuccess: () => {
            toast.success('Đã thêm vào giỏ hàng')
          },
          onError: () => {
            toast.error('Không thể thêm vào giỏ hàng')
          }
        }
      )
    }
  }

  // Display loading state
  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  // Display error state
  if (error || !product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', flexDirection: 'column' }}>
        <Typography variant='h5' color='error' gutterBottom>
          Không thể tải thông tin sản phẩm
        </Typography>
        <Typography variant='body1'>Vui lòng thử lại sau</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        'maxWidth': '1400px',
        'mx': 'auto',
        'px': { xs: 2, md: 3 },
        '& .MuiPaper-root': {
          border: { xs: 'none', md: '1px solid' },
          borderColor: { xs: 'transparent', md: 'divider' },
          boxShadow: { xs: 'none', md: 1 }
        },
        '& .MuiLink-root': {
          'textDecoration': { xs: 'none', md: 'underline' },
          '&:hover': {
            textDecoration: { xs: 'none', md: 'underline' }
          }
        },
        '& .MuiCard-root': {
          border: { xs: 'none', md: '1px solid' },
          borderColor: { xs: 'transparent', md: 'divider' },
          boxShadow: { xs: 'none', md: 1 }
        },
        '& .MuiDivider-root': {
          borderWidth: { xs: 0, md: 1 }
        }
      }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNext fontSize='small' />}
        aria-label='breadcrumb'
        sx={{
          'mb': 3,
          'mt': 1,
          '& .MuiLink-root': {
            'textDecoration': 'none',
            '&:hover': {
              textDecoration: 'none'
            }
          }
        }}
      >
        <Link href='/' style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography color='text.secondary'>Trang Chủ</Typography>
        </Link>
        <Link href='/products' style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography color='text.primary'>Sản Phẩm</Typography>
        </Link>
        <Typography color='text.primary'>{product.name}</Typography>
      </Breadcrumbs>

      {/* Product Main Info Section */}
      <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 5 }}>
        {/* Left: Product Gallery */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              '& .MuiPaper-root': {
                border: { xs: 'none', md: '1px solid' },
                borderColor: { xs: 'transparent', md: 'divider' }
              }
            }}
          >
            <ProductGallery images={product.images || []} defaultImage={product.defaultImage} videoUrl={product.videoUrl} productName={product.name} />
          </Box>
        </Grid>

        {/* Right: Product Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              '& .MuiPaper-root': {
                border: { xs: 'none', md: '1px solid' },
                borderColor: { xs: 'transparent', md: 'divider' }
              }
            }}
          >
            <ProductInfo
              product={product}
              isProductInWishlist={isProductInWishlist}
              isProductAddingToCart={isAddingToCart}
              isProductAddingToWishlist={isAddingToWishlist}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToFavorites}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Product Description Section */}
      <Box
        sx={{
          '& .MuiPaper-root': {
            border: { xs: 'none', md: '1px solid' },
            borderColor: { xs: 'transparent', md: 'divider' }
          }
        }}
      >
        <ProductDescription description={product.description || ''} />
      </Box>

      {/* Reviews Section */}
      <Box
        sx={{
          '& .MuiPaper-root': {
            border: { xs: 'none', md: '1px solid' },
            borderColor: { xs: 'transparent', md: 'divider' }
          }
        }}
      >
        <ProductReviews reviews={product.reviews || []} />
      </Box>

      {/* Related Products Section */}
      {relatedProducts?.length > 0 && (
        <Box
          sx={{
            '& .MuiCard-root': {
              border: { xs: 'none', md: '1px solid' },
              borderColor: { xs: 'transparent', md: 'divider' }
            }
          }}
        >
          <Typography variant='h5' fontWeight={700} color='primary.main' sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Widgets /> Sản phẩm liên quan
          </Typography>
          <ProductList products={relatedProducts} />
        </Box>
      )}
    </Box>
  )
}

// Main component with error handling
export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render the content after client-side hydration
  if (!mounted) {
    return <ProductDetailSkeleton />
  }

  // If no ID is available, show loading state
  if (!id) {
    return <ProductDetailSkeleton />
  }

  return <ProductDetailContent productId={id} />
}
