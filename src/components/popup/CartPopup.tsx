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

  // Use cart query hook directly
  const { data: cartData, isLoading: cartLoading, refetch: refreshCart } = useFetchGetCart()

  // Refetch cart data when popup opens
  useEffect(() => {
    if (open) {
      refreshCart()
    }
  }, [open, refreshCart])

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

  return (
    <SideDrawer open={open} onClose={onClose} title='Giỏ Hàng' icon={<ShoppingCartIcon />} footer={cartFooter}>
      {cartLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress color='primary' />
        </Box>
      ) : cartCount === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            maxHeight: '400px',
            p: 3,
            textAlign: 'center'
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
          <Typography variant='h6' color='text.secondary' gutterBottom>
            Giỏ hàng trống
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ maxWidth: '250px', mb: 3 }}>
            Bạn chưa có sản phẩm nào trong giỏ hàng.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={onClose}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              px: 3
            }}
          >
            Tiếp Tục Mua Sắm
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1 }}>
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </Box>
      )}
    </SideDrawer>
  )
}

export default CartPopup
