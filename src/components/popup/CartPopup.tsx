'use client'

import CartItem from '@/components/popup/CartItem'
import SideDrawer from '@/components/popup/SideDrawer'
import { useFetchGetCart } from '@/hooks/apis/cart'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Box, Button, CircularProgress, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

interface CartPopupProps {
  open: boolean
  onClose: () => void
}

const CartPopup: React.FC<CartPopupProps> = ({ open, onClose }) => {
  const theme = useTheme()
  const router = useRouter()
  const {
    data: cartData,
    isLoading,
    refetch
  } = useFetchGetCart({
    onError: error => {
      toast.error(error.message || 'Không thể tải giỏ hàng')
    }
  })

  // Refetch cart data when popup opens
  useEffect(() => {
    if (open) {
      refetch()
    }
  }, [open, refetch])

  const cartItems = cartData?.data?.items || []
  const cartCount = cartData?.data?.totalQuantity || 0
  const totalPrice = cartData?.data?.totalPrice || 0

  const handleCheckout = () => {
    if (cartCount === 0) {
      toast.error('Giỏ hàng trống', { position: 'top-center' })
      return
    }
    onClose()
    router.push('/checkout')
  }

  // Footer for cart with total and checkout button
  const cartFooter = cartCount > 0 && (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 1.5, sm: 2 } }}>
        <Typography variant='body1' sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, color: '#000000' }}>
          Tổng cộng:
        </Typography>
        <Typography
          variant='h6'
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            color: theme.palette.primary.main
          }}
        >
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
        </Typography>
      </Box>
      <Button
        onClick={handleCheckout}
        variant='contained'
        fullWidth
        sx={{
          'backgroundColor': theme.palette.primary.main,
          'color': '#ffffff',
          'borderRadius': '30px',
          'padding': { xs: '10px 20px', sm: '12px 24px' },
          'fontWeight': 'bold',
          'textTransform': 'none',
          'fontSize': { xs: '0.875rem', sm: '1rem' },
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          }
        }}
      >
        Thanh toán
      </Button>
    </>
  )

  // Cart content based on loading state and cart items
  const cartContent = isLoading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <CircularProgress size={40} />
    </Box>
  ) : cartCount === 0 ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flex: 1,
        py: { xs: 4, sm: 6 }
      }}
    >
      <ShoppingBagOutlinedIcon
        sx={{
          fontSize: { xs: 60, sm: 80 },
          color: '#cccccc',
          mb: { xs: 2, sm: 3 }
        }}
      />
      <Typography
        variant='h6'
        gutterBottom
        sx={{
          fontWeight: 'bold',
          fontSize: { xs: '1.125rem', sm: '1.25rem' },
          color: '#000000'
        }}
      >
        Giỏ hàng của bạn đang trống
      </Typography>
      <Typography
        variant='body1'
        sx={{
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '0.875rem', sm: '1rem' },
          color: '#666666'
        }}
      >
        Thêm sản phẩm vào giỏ hàng để mua sắm.
      </Typography>
      <Button
        variant='contained'
        onClick={onClose}
        sx={{
          'backgroundColor': theme.palette.primary.main,
          'color': '#ffffff',
          'borderRadius': '30px',
          'padding': { xs: '8px 20px', sm: '10px 24px' },
          'fontWeight': 'bold',
          'textTransform': 'none',
          'fontSize': { xs: '0.875rem', sm: '1rem' },
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          }
        }}
      >
        Tiếp tục mua sắm
      </Button>
    </Box>
  ) : (
    <Box sx={{ width: '100%' }}>
      <Typography
        sx={{
          fontSize: { xs: '0.875rem', sm: '1rem' },
          color: '#000000',
          mb: 2
        }}
      >
        Bạn có {cartCount} sản phẩm trong giỏ hàng.
      </Typography>

      {/* Cart items */}
      {cartItems.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
    </Box>
  )

  return (
    <SideDrawer open={open} onClose={onClose} title='Giỏ hàng' icon={<ShoppingCartIcon />} count={cartCount} footer={cartFooter}>
      {cartContent}
    </SideDrawer>
  )
}

export default CartPopup
