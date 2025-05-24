'use client'

import { useFetchAddToCart } from '@/hooks/apis/cart'
import { ProductListData } from '@/hooks/apis/product'
import { useAddToWishlist } from '@/hooks/apis/wishlist'
import { QueryKey } from '@/models/QueryKey'
import { formatCurrency } from '@/utils/format'
import { AddShoppingCart, Favorite } from '@mui/icons-material'
import { alpha, Badge, Box, Card, CardContent, Chip, IconButton, styled, Tooltip, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
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

const Tag = styled(Box)<TagProps>(({ theme, type }) => ({
  position: 'absolute',
  top: 8,
  left: 8,
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.75rem',
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

// Product name with exactly one line and ellipsis
const ProductName = styled(Typography)({
  'display': '-webkit-box',
  'WebkitLineClamp': 1,
  'WebkitBoxOrient': 'vertical',
  'overflow': 'hidden',
  'textOverflow': 'ellipsis',
  'whiteSpace': 'normal',
  'lineHeight': '1.5rem',
  'maxHeight': '1.5rem',
  'fontWeight': 600,
  'cursor': 'pointer',
  'marginBottom': '8px',
  '&:hover': {
    textDecoration: 'underline'
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
  fontSize: '0.75rem',
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
  fontSize: '0.75rem',
  color: instock ? theme.palette.success.main : theme.palette.error.main,
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
}))

const CategoryChip = styled(Chip)(({ theme }) => ({
  height: 20,
  fontSize: '0.7rem',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 500
}))

export default function ProductItem({ product }: ProductItemProps) {
  const [hovered, setHovered] = useState(false)
  const queryClient = useQueryClient()
  const { mutate: addToWishlist, isPending: isAddingToWishlist } = useAddToWishlist({
    onSuccess: () => {
      toast.success('Đã thêm vào danh sách yêu thích', { position: 'top-center' })
      queryClient.invalidateQueries({ queryKey: [QueryKey.WISHLIST_LIST] })
    },
    onError: error => {
      if (error.errorCode === 4) {
        toast.error('Vui lòng đăng nhập để sử dụng tính năng này', { position: 'top-center' })
      } else {
        toast.error(error.message || 'Lỗi khi thêm vào danh sách yêu thích', { position: 'top-center' })
      }
    }
  })
  const { mutate: addToCart, isPending: isAddingToCart } = useFetchAddToCart({
    onSuccess: () => {
      toast.success('Đã thêm vào giỏ hàng', { position: 'top-center' })
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_CART] })
    },
    onError: error => {
      if (error.errorCode === 4) {
        toast.error('Vui lòng đăng nhập để sử dụng tính năng này', { position: 'top-center' })
      } else {
        toast.error(error.message || 'Lỗi khi thêm vào giỏ hàng', { position: 'top-center' })
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
    addToCart({ productId: product.id })
  }

  const handleAddToWishlist = () => {
    addToWishlist(product.id)
  }

  return (
    <ProductCardWrapper onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
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
              sx={{
                left: discountPercentage ? 8 : 8,
                top: discountPercentage ? (product.isHotSale ? 72 : 40) : product.isHotSale ? 40 : 8
              }}
            >
              Nổi Bật
            </Tag>
          )}

          {/* Add to Cart & Wishlist buttons with improved tooltips */}
          <IconButtonContainer className='action-buttons' sx={{ opacity: hovered ? 1 : 0 }}>
            {/* Add to Cart Button */}
            <Tooltip title={isOutOfStock ? 'Hết Hàng' : 'Thêm Vào Giỏ'} placement='left' arrow enterDelay={500} leaveDelay={200}>
              <span>
                <ActionIconButton
                  size='small'
                  color='primary'
                  sx={{
                    '&:hover': {
                      bgcolor: theme => alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                  disabled={isOutOfStock || isAddingToCart}
                  onClick={handleAddToCart}
                  aria-label='Add to cart'
                >
                  <AddShoppingCart fontSize='small' color={isOutOfStock ? 'disabled' : 'primary'} />
                </ActionIconButton>
              </span>
            </Tooltip>

            {/* Add to Wishlist Button */}
            <Tooltip title='Thêm Vào Yêu Thích' placement='left' arrow enterDelay={500} leaveDelay={200}>
              <ActionIconButton
                size='small'
                color='default'
                sx={{
                  '&:hover': {
                    bgcolor: theme => alpha(theme.palette.error.main, 0.1)
                  }
                }}
                onClick={handleAddToWishlist}
                aria-label='Add to wishlist'
                disabled={isAddingToWishlist}
              >
                <Favorite fontSize='small' color={hovered ? 'error' : 'action'} />
              </ActionIconButton>
            </Tooltip>
          </IconButtonContainer>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <StockOverlay>
              <Badge
                badgeContent={'Hết Hàng'}
                color='error'
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '1rem',
                    height: 'auto',
                    padding: '8px 12px',
                    borderRadius: '4px'
                  }
                }}
              />
            </StockOverlay>
          )}
        </MediaContainer>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Category */}
          {product.subCategory && (
            <Box sx={{ mb: 1 }}>
              <CategoryChip label={product.subCategory.name} size='small' />
            </Box>
          )}

          {/* Product Name with Tooltip */}
          <Link href={`/products/${product.id}`} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <Tooltip title={product.name} placement='top' arrow>
              <ProductName variant='subtitle1'>{product.name}</ProductName>
            </Tooltip>
          </Link>

          {/* Price Display */}
          <Box sx={{ mt: 1 }}>
            {product.salePrice ? (
              <Box display='flex' alignItems='center' gap={1}>
                <Typography variant='body1' color='error' fontWeight='bold'>
                  {formatCurrency(product.salePrice)}
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ textDecoration: 'line-through' }}>
                  {formatCurrency(product.price)}
                </Typography>
              </Box>
            ) : (
              <Typography variant='body1' fontWeight='bold'>
                {formatCurrency(product.price)}
              </Typography>
            )}
          </Box>

          {/* Stock status and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Box display='flex' alignItems='center'>
              <Typography variant='body2' color='text.secondary' fontWeight={500}>
                Thương hiệu:&nbsp;
              </Typography>
              <Link href={`/products/brand/${product.brand.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant='body2' color='text.secondary' sx={{ '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}>
                  {product.brand.name}
                </Typography>
              </Link>
            </Box>

            <StockIndicator instock={!isOutOfStock}>{isOutOfStock ? 'Hết hàng' : `Còn hàng: ${product.stock?.quantity || 0}`}</StockIndicator>
          </Box>
        </CardContent>
      </ProductCard>
    </ProductCardWrapper>
  )
}
