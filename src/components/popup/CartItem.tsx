'use client'

import { useFetchDeleteCartItem, useFetchUpdateCartItem } from '@/hooks/apis/cart'
import { QueryKey } from '@/models/QueryKey'
import { type ResCartType } from '@/types/cart.type'
import { formatCurrency } from '@/utils/format'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RemoveIcon from '@mui/icons-material/Remove'
import { alpha, Box, IconButton, Link, Stack, Typography, useTheme } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { toast } from 'react-toastify'

// Use the CartItemType from ResCartType
type CartItemType = ResCartType['items'][0]

interface CartItemProps {
  item: CartItemType
}

const CartItem = ({ item }: CartItemProps) => {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { mutate: deleteCartItem, isPending: isDeleting } = useFetchDeleteCartItem({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_CART] })
    },
    onError: error => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng')
    }
  })

  const { mutate: updateCartItem, isPending: isUpdating } = useFetchUpdateCartItem({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_CART] })
    },
    onError: error => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật số lượng sản phẩm')
    }
  })

  const handleUpdateQuantity = (quantity: number) => {
    if (quantity < 1) {
      handleRemoveItem()
      return
    }

    updateCartItem({
      cartItemId: item.id,
      quantity
    })
  }

  const handleRemoveItem = () => {
    deleteCartItem(item.id)
  }

  const { product } = item
  const isOnSale = product.salePrice < product.price
  const displayPrice = product.salePrice > 0 ? product.salePrice : product.price
  const totalPrice = displayPrice * item.quantity

  return (
    <Box
      sx={{
        'display': 'flex',
        'p': 2,
        'mb': 2,
        'borderRadius': 2,
        'bgcolor': '#ffffff',
        'position': 'relative',
        'transition': 'all 0.2s ease',
        'border': '1px solid',
        'borderColor': 'divider',
        '&:hover': {
          bgcolor: alpha(theme.palette.background.default, 0.7),
          borderColor: theme.palette.divider
        }
      }}
    >
      {/* Product Image */}
      <Box
        sx={{
          borderRadius: 1,
          overflow: 'hidden',
          width: 70,
          height: 70,
          position: 'relative',
          flexShrink: 0,
          border: '1px solid rgba(0,0,0,0.07)'
        }}
      >
        <Image src={product.defaultImage.url} alt={product.name} fill style={{ objectFit: 'cover' }} sizes='70px' priority />
        {isOnSale && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bgcolor: theme.palette.error.main,
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              py: 0.3,
              px: 0.5,
              borderBottomRightRadius: 4
            }}
          >
            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
          </Box>
        )}
      </Box>

      {/* Product Details */}
      <Box sx={{ ml: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0, pr: 5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Link href={`/products/${product.id}`} sx={{ textDecoration: 'none', display: 'block' }}>
            <Typography
              variant='body1'
              sx={{
                'display': '-webkit-box',
                'WebkitLineClamp': 2,
                'WebkitBoxOrient': 'vertical',
                'overflow': 'hidden',
                'textOverflow': 'ellipsis',
                'fontWeight': 500,
                'color': 'text.primary',
                'transition': 'color 0.2s',
                'lineHeight': '1.3',
                'maxHeight': '2.6em',
                'wordBreak': 'break-word',
                'width': '100%',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              {product.name}
            </Typography>
          </Link>
          {/* Price */}
          <Box mt={0.5}>
            {product.salePrice > 0 ? (
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

        {/* Quantity Controls and Total */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
          <Stack direction='row' alignItems='center' spacing={0}>
            <IconButton
              size='small'
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={isUpdating}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '4px 0 0 4px',
                p: 0.5
              }}
            >
              <RemoveIcon fontSize='small' />
            </IconButton>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderLeft: 0,
                borderRight: 0,
                width: 36,
                height: 30
              }}
            >
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                {item.quantity}
              </Typography>
            </Box>

            <IconButton
              size='small'
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isUpdating}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '0 4px 4px 0',
                p: 0.5
              }}
            >
              <AddIcon fontSize='small' />
            </IconButton>
          </Stack>

          <Typography
            variant='subtitle2'
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main
            }}
          >
            {formatCurrency(totalPrice)}
          </Typography>
        </Box>
      </Box>

      {/* Remove Button */}
      <IconButton
        size='small'
        disabled={isDeleting}
        onClick={handleRemoveItem}
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
        <DeleteOutlineIcon fontSize='small' />
      </IconButton>
    </Box>
  )
}

export default CartItem
