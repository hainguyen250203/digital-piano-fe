'use client'

import { useFetchDeleteCartItem, useFetchUpdateCartItem } from '@/hooks/apis/cart'
import { type ResCartType } from '@/types/cart.type'
import { formatCurrency } from '@/utils/format'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RemoveIcon from '@mui/icons-material/Remove'
import { alpha, Box, CircularProgress, IconButton, Link, Stack, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'react-toastify'

// Use the CartItemType from ResCartType
type CartItemType = ResCartType['items'][0]

interface CartItemProps {
  item: CartItemType
}

const CartItem = ({ item }: CartItemProps) => {
  const theme = useTheme()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Cart mutations
  const { mutate: updateCartItemMutation } = useFetchUpdateCartItem({
    onSuccess: () => {
      toast.success('Đã cập nhật giỏ hàng', { position: 'top-center' })
    },
    onError: error => {
      toast.error(error.message || 'Lỗi khi cập nhật giỏ hàng', { position: 'top-center' })
    }
  })

  const { mutate: removeCartItemMutation } = useFetchDeleteCartItem({
    onSuccess: () => {
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng', { position: 'top-center' })
    },
    onError: error => {
      toast.error(error.message || 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', { position: 'top-center' })
    }
  })

  const handleUpdateQuantity = (quantity: number) => {
    if (quantity < 1) {
      handleRemoveItem()
      return
    }

    setIsUpdating(true)
    updateCartItemMutation(
      { cartItemId: item.id, quantity },
      {
        onSettled: () => {
          setIsUpdating(false)
        }
      }
    )
  }

  const handleRemoveItem = () => {
    setIsDeleting(true)
    removeCartItemMutation(item.id, {
      onSettled: () => {
        setIsDeleting(false)
      }
    })
  }

  const { product } = item
  const displayPrice = product.salePrice > 0 ? product.salePrice : product.price
  const totalPrice = displayPrice * item.quantity

  return (
    <Box
      sx={{
        'display': 'flex',
        'position': 'relative',
        'p': 1.5,
        'borderRadius': 1,
        'mb': 1,
        'backgroundColor': 'background.paper',
        'border': '1px solid',
        'borderColor': 'divider',
        '&:hover': {
          boxShadow: 1,
          borderColor: 'primary.light',
          backgroundColor: alpha(theme.palette.primary.light, 0.03)
        },
        ...((isUpdating || isDeleting) && {
          opacity: 0.7
        })
      }}
    >
      {/* Delete button */}
      <IconButton
        size='small'
        onClick={handleRemoveItem}
        disabled={isDeleting || isUpdating}
        sx={{
          'position': 'absolute',
          'top': 8,
          'right': 8,
          'color': 'text.secondary',
          'p': 0.5,
          '&:hover': {
            color: 'error.main',
            backgroundColor: alpha(theme.palette.error.main, 0.1)
          }
        }}
      >
        {isDeleting ? <CircularProgress size={16} color='error' /> : <DeleteOutlineIcon fontSize='small' />}
      </IconButton>

      {/* Product Image */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: 1,
          overflow: 'hidden',
          flexShrink: 0,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'white',
          position: 'relative'
        }}
      >
        <Image src={product.defaultImage?.url || '/placeholder-image.jpg'} alt={product.name} fill sizes='80px' style={{ objectFit: 'contain', padding: '4px' }} />
      </Box>

      {/* Product Info */}
      <Box sx={{ ml: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0, pr: 5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Link href={`/products/${product.id}`} sx={{ textDecoration: 'none', display: 'block' }}>
            <Typography
              variant='subtitle2'
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
                  variant='caption'
                  color='text.secondary'
                  component='span'
                  sx={{
                    textDecoration: 'line-through',
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
              disabled={isUpdating || isDeleting}
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
                height: 30,
                position: 'relative'
              }}
            >
              {isUpdating ? (
                <CircularProgress size={16} color='primary' />
              ) : (
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {item.quantity}
                </Typography>
              )}
            </Box>

            <IconButton
              size='small'
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isUpdating || isDeleting}
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
    </Box>
  )
}

export default CartItem
