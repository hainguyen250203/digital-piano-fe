'use client'

import { useFetchAddToCart } from '@/hooks/apis/cart'
import { useAddToWishlist, useFetchWishlist } from '@/hooks/apis/wishlist'
import { ProductListData } from '@/types/product.type'
import { isAuthenticated } from '@/utils/auth'
import { formatCurrency } from '@/utils/format'
import { AddShoppingCart, Favorite } from '@mui/icons-material'
import { alpha, Box, Card, CardContent, Chip, CircularProgress, IconButton, styled, Tooltip, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'

// Type definitions
type TagType = 'hot' | 'featured'

interface TagProps {
  type: TagType
}

interface ProductItemProps {
  product: ProductListData
}

// Styled components
const ProductCard = styled(Card)(({ theme }) => ({
  'backgroundColor': 'white',
  'position': 'relative',
  'height': '100%',
  'display': 'flex',
  'flexDirection': 'column',
  'transition': 'all 0.3s ease',
  'borderRadius': theme.shape.borderRadius * 1.5,
  'overflow': 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4]
  }
}))

const MediaContainer = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  aspectRatio: '1/1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5'
})

const StyledCardMedia = styled(Box)({
  height: '100%',
  width: '100%',
  position: 'relative',
  transition: 'transform 0.5s ease'
})

const Tag = styled(Typography)<TagProps>(({ theme, type }) => ({
  position: 'absolute',
  top: 8,
  left: 8,
  padding: '4px 8px',
  borderRadius: '4px',
  fontWeight: 'bold',
  color: '#fff',
  zIndex: 1,
  backgroundColor: type === 'hot' ? theme.palette.error.main : theme.palette.primary.main
}))

// Enhanced action buttons container with better spacing
const IconButtonContainer = styled(Box)({
  position: 'absolute',
  top: 8,
  right: 8,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px', // Increased gap for better spacing between buttons
  opacity: 0,
  transform: 'translateX(10px)',
  transition: 'all 0.3s ease',
  zIndex: 2
})

// Enhanced IconButton styles
const ActionIconButton = styled(IconButton)({
  'bgcolor': 'white',
  'boxShadow': '0 2px 5px rgba(0,0,0,0.1)',
  'transition': 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)'
  }
})

const ProductCardWrapper = styled(Box)({
  'position': 'relative',
  'height': '100%',
  '&:hover': {
    '& .image-zoom': {
      transform: 'scale(1.05)'
    },
    '& .action-buttons': {
      opacity: 1,
      transform: 'translateX(0)'
    }
  }
})

const StockOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2
}))

const DiscountTag = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  left: 8,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  zIndex: 1,
  height: 24
}))

interface StockIndicatorProps {
  instock: boolean
}

const StockIndicator = styled(Typography, {
  shouldForwardProp: prop => prop !== 'instock'
})<StockIndicatorProps>(({ theme, instock }) => ({
  color: instock ? theme.palette.success.main : theme.palette.error.main,
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
}))

const CategoryChip = styled(Chip)(({ theme }) => ({
  height: 20,
  fontWeight: 500,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main
}))

export default function ProductItem({ product }: ProductItemProps) {
  const isLoggedIn = isAuthenticated()
  // Only fetch wishlist data if user is logged in
  const { data: wishlistData } = useFetchWishlist()
  const isInWishlist = isLoggedIn ? wishlistData?.data?.some(item => item.product.id === product.id) || false : false

  // Cart mutation
  const { mutate: addToCartMutation, isPending: addToCartPending } = useFetchAddToCart({
    onError: error => {
      if (error.errorCode === 4) {
        toast.error('Vui lòng đăng nhập để sử dụng tính năng này', { position: 'top-center' })
      } else {
        toast.error(error.message || 'Lỗi khi thêm vào giỏ hàng', { position: 'top-center' })
      }
    }
  })

  // Wishlist mutation
  const { mutate: addToWishlistMutation, isPending: addToWishlistPending } = useAddToWishlist({
    onError: error => {
      if (error.errorCode === 4) {
        toast.error('Vui lòng đăng nhập để sử dụng tính năng này', { position: 'top-center' })
      } else {
        toast.error(error.message || 'Lỗi khi thêm vào danh sách yêu thích', { position: 'top-center' })
      }
    }
  })

  if (!product) {
    return null
  }

  const isOutOfStock = !product.stock || product.stock.quantity === 0
  const discountPercentage = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : null
  const imageUrl = product.defaultImage?.url || 'https://www.aaronfaber.com/wp-content/uploads/2017/03/product-placeholder-wp.jpg'

  const handleAddToCart = () => {
    if (isOutOfStock) return
    console.log('Attempting to add to cart:', product.id)
    addToCartMutation({ productId: product.id })
  }

  const handleAddToWishlist = () => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng này', { position: 'top-center' })
      return
    }
    addToWishlistMutation(product.id)
  }

  return (
    <ProductCardWrapper>
      <ProductCard sx={{ opacity: isOutOfStock ? 0.7 : 1 }}>
        <MediaContainer>
          <StyledCardMedia className='image-zoom'>
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              style={{
                objectFit: 'contain',
                padding: '16px',
                backgroundColor: 'white'
              }}
              priority={false}
            />
          </StyledCardMedia>

          {/* Discount Tag */}
          {discountPercentage && <DiscountTag label={`-${discountPercentage}%`} size='small' />}

          {/* Hot Sale Tag */}
          {product.isHotSale && (
            <Tag
              type='hot'
              variant='caption'
              sx={{
                left: discountPercentage ? 8 : 8,
                top: discountPercentage ? 40 : 8
              }}
            >
              Khuyến Mãi
            </Tag>
          )}

          {/* Featured Tag */}
          {product.isFeatured && (
            <Tag
              type='featured'
              variant='caption'
              sx={{
                left: discountPercentage ? 8 : 8,
                top: discountPercentage ? (product.isHotSale ? 72 : 40) : product.isHotSale ? 40 : 8
              }}
            >
              Nổi Bật
            </Tag>
          )}

          {/* Out Of Stock Overlay */}
          {isOutOfStock && (
            <StockOverlay>
              <Typography variant='subtitle1' sx={{ color: 'error.main', bgcolor: 'background.paper', py: 1, px: 3, borderRadius: 1, fontWeight: 'bold' }}>
                Hết Hàng
              </Typography>
            </StockOverlay>
          )}

          {/* Action Buttons */}
          <IconButtonContainer className='action-buttons'>
            <Tooltip title='Thêm vào giỏ hàng'>
              <span>
                <ActionIconButton aria-label='add to cart' color='primary' disabled={addToCartPending || isOutOfStock} onClick={handleAddToCart}>
                  {addToCartPending ? <CircularProgress size={20} /> : <AddShoppingCart fontSize='small' />}
                </ActionIconButton>
              </span>
            </Tooltip>
            <Tooltip title={!isLoggedIn ? 'Đăng nhập để thêm vào yêu thích' : isInWishlist ? 'Đã thêm vào yêu thích' : 'Thêm vào yêu thích'}>
              <span>
                <ActionIconButton
                  aria-label='add to wishlist'
                  sx={{
                    'color': isInWishlist ? 'error.main' : 'inherit',
                    '&.Mui-disabled': {
                      color: isInWishlist ? 'error.main' : 'inherit',
                      opacity: isInWishlist ? 1 : 0.5
                    }
                  }}
                  disabled={addToWishlistPending || isInWishlist || !isLoggedIn}
                  onClick={handleAddToWishlist}
                >
                  {addToWishlistPending ? <CircularProgress size={20} /> : <Favorite fontSize='small' />}
                </ActionIconButton>
              </span>
            </Tooltip>
          </IconButtonContainer>
        </MediaContainer>

        <CardContent sx={{ p: 2, pt: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 0.5, display: 'flex', gap: 0.5 }}>{product.productType?.name && <CategoryChip label={product.productType.name} size='small' />}</Box>

          <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant='subtitle1'
              component='h3'
              sx={{
                'display': '-webkit-box',
                'WebkitLineClamp': 2,
                'WebkitBoxOrient': 'vertical',
                'overflow': 'hidden',
                'textOverflow': 'ellipsis',
                'fontWeight': 500,
                'mb': 1,
                'lineHeight': 1.3,
                'height': '2.6em',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              {product.name}
            </Typography>
          </Link>

          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {product.salePrice && product.salePrice > 0 ? (
                <>
                  <Typography variant='body2' color='text.secondary' sx={{ textDecoration: 'line-through' }}>
                    {formatCurrency(product.price)}
                  </Typography>
                  <Typography variant='subtitle1' color='error.main' fontWeight={600}>
                    {formatCurrency(product.salePrice)}
                  </Typography>
                </>
              ) : (
                <Typography variant='subtitle1' color='text.primary' fontWeight={600}>
                  {formatCurrency(product.price)}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <StockIndicator variant='caption' instock={!isOutOfStock}>
                {!isOutOfStock ? `Còn ${product.stock?.quantity || 0} sản phẩm` : 'Hết hàng'}
              </StockIndicator>

              {/* Reviews will be added in future implementation */}
            </Box>
          </Box>
        </CardContent>
      </ProductCard>
    </ProductCardWrapper>
  )
}
