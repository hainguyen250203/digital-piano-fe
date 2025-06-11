'use client'

import { useFetchAddToCart } from '@/hooks/apis/cart'
import { useDeleteFromWishlistByProduct } from '@/hooks/apis/wishlist'
import { WishlistItemData } from '@/services/apis/wishlist'
import { formatCurrency } from '@/utils/format'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { alpha, Box, Button, CircularProgress, Fade, IconButton, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface FavoriteProductsListProps {
  favoriteProducts: WishlistItemData[]
  onClose: () => void
}

export default function FavoriteProductsList({ favoriteProducts, onClose }: FavoriteProductsListProps) {
  const theme = useTheme()
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set())

  // Cart mutation
  const { mutate: addToCartMutation } = useFetchAddToCart({
    onSuccess: () => {
      toast.success('Đã thêm vào giỏ hàng', { position: 'top-center' })
    },
    onError: error => {
      if (error.errorCode === 4) {
        toast.error('Vui lòng đăng nhập để sử dụng tính năng này', { position: 'top-center' })
      } else {
        toast.error(error.message || 'Lỗi khi thêm vào giỏ hàng', { position: 'top-center' })
      }
    }
  })

  // Wishlist mutations
  const { mutate: removeFromWishlistMutation } = useDeleteFromWishlistByProduct({
    onSuccess: () => {
      toast.success('Đã xóa khỏi danh sách yêu thích', { position: 'top-center' })
    },
    onError: error => {
      if (error.errorCode === 4) {
        toast.error('Vui lòng đăng nhập để sử dụng tính năng này', { position: 'top-center' })
      } else {
        toast.error(error.message || 'Lỗi khi xóa khỏi danh sách yêu thích', { position: 'top-center' })
      }
    }
  })

  const handleDeleteWishlist = (productId: string) => {
    setProcessingItems(prev => new Set(prev).add(`delete-${productId}`))
    removeFromWishlistMutation(productId, {
      onSettled: () => {
        setProcessingItems(prev => {
          const updated = new Set(prev)
          updated.delete(`delete-${productId}`)
          return updated
        })
      }
    })
  }

  const handleAddToCart = (productId: string) => {
    setProcessingItems(prev => new Set(prev).add(`cart-${productId}`))
    addToCartMutation(
      { productId },
      {
        onSettled: () => {
          setProcessingItems(prev => {
            const updated = new Set(prev)
            updated.delete(`cart-${productId}`)
            return updated
          })
        }
      }
    )
  }

  const isProcessingDelete = (productId: string) => processingItems.has(`delete-${productId}`)
  const isProcessingAddToCart = (productId: string) => processingItems.has(`cart-${productId}`)

  if (favoriteProducts.length === 0) {
    return (
      <Fade in>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            height: '70vh',
            p: 3
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant='h6' gutterBottom>
            Danh sách yêu thích trống
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3, maxWidth: 300 }}>
            Bạn chưa thêm sản phẩm nào vào danh sách yêu thích. Hãy khám phá các sản phẩm của chúng tôi để tìm thấy món đồ bạn yêu thích.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={onClose}
            sx={{
              borderRadius: '20px',
              textTransform: 'none'
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </Box>
      </Fade>
    )
  }

  return (
    <Fade in>
      <Box sx={{ p: 1 }}>
        {favoriteProducts.map((favoriteProduct: WishlistItemData) => {
          const { product } = favoriteProduct
          const isDeleting = isProcessingDelete(product.id)
          const isAddingToCart = isProcessingAddToCart(product.id)
          const isProcessing = isDeleting || isAddingToCart

          return (
            <Box
              key={favoriteProduct.id}
              sx={{
                'display': 'flex',
                'position': 'relative',
                'p': 1.5,
                'mb': 2,
                'borderRadius': 1,
                'bgcolor': 'background.paper',
                'border': '1px solid',
                'borderColor': 'divider',
                '&:hover': {
                  boxShadow: 1,
                  borderColor: 'primary.light',
                  bgcolor: alpha(theme.palette.primary.light, 0.03)
                },
                ...(isProcessing && {
                  opacity: 0.7
                })
              }}
            >
              {/* Product Image */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'white'
                }}
              >
                <Image src={product.defaultImage?.url || '/placeholder-image.jpg'} alt={product.name} fill sizes='80px' style={{ objectFit: 'contain', padding: '4px' }} />
              </Box>

              {/* Product Details */}
              <Box sx={{ ml: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0, pr: 6 }}>
                <Box>
                  <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }} onClick={() => onClose()}>
                    <Typography
                      variant='body1'
                      sx={{
                        'display': '-webkit-box',
                        'WebkitLineClamp': 2,
                        'WebkitBoxOrient': 'vertical',
                        'overflow': 'hidden',
                        'textOverflow': 'ellipsis',
                        'color': 'text.primary',
                        'fontWeight': 500,
                        'lineHeight': 1.3,
                        'transition': 'color 0.2s',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      {product.name}
                    </Typography>
                  </Link>

                  {/* Price display */}
                  <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center' }}>
                    {product.salePrice && product.salePrice < product.price ? (
                      <>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          component='span'
                          sx={{
                            textDecoration: 'line-through',
                            fontSize: '0.75rem',
                            mr: 1
                          }}
                        >
                          {formatCurrency(product.price)}
                        </Typography>
                        <Typography variant='body2' color='error' component='span' fontWeight='medium'>
                          {formatCurrency(product.salePrice)}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant='body2' color='text.primary' fontWeight='medium'>
                        {formatCurrency(product.price)}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Add to Cart Button */}
                <Button
                  variant='outlined'
                  color='primary'
                  size='small'
                  startIcon={isAddingToCart ? <CircularProgress size={16} /> : <ShoppingCartOutlinedIcon />}
                  onClick={() => handleAddToCart(product.id)}
                  disabled={isProcessing}
                  sx={{
                    mt: 1,
                    borderRadius: 1,
                    textTransform: 'none',
                    alignSelf: 'flex-start'
                  }}
                >
                  {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
                </Button>
              </Box>

              <IconButton
                onClick={() => handleDeleteWishlist(product.id)}
                disabled={isProcessing}
                size='small'
                sx={{
                  'position': 'absolute',
                  'top': 8,
                  'right': 8,
                  'p': 0.5,
                  'color': 'text.secondary',
                  '&:hover': {
                    color: theme.palette.error.main,
                    bgcolor: alpha(theme.palette.error.light, 0.1)
                  }
                }}
              >
                {isDeleting ? <CircularProgress size={16} color='error' /> : <DeleteOutlineIcon fontSize='small' />}
              </IconButton>
            </Box>
          )
        })}
      </Box>
    </Fade>
  )
}
