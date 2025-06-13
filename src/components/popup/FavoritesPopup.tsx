'use client'

import FavoriteProductsList from '@/components/popup/favorite-products-list'
import SideDrawer from '@/components/popup/SideDrawer'
import { useFetchWishlist } from '@/hooks/apis/wishlist'
import { isAuthenticated } from '@/utils/auth'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useEffect } from 'react'

interface FavoritesPopupProps {
  open: boolean
  onClose: () => void
  onLoginClick?: () => void
}

export default function FavoritesPopup({ open, onClose, onLoginClick }: FavoritesPopupProps) {
  const isLoggedIn = isAuthenticated()
  const { data: wishlistData, isLoading: wishlistLoading, refetch: refreshWishlist } = useFetchWishlist()

  // Refresh wishlist data when the popup opens
  useEffect(() => {
    if (open && isLoggedIn) {
      refreshWishlist()
    }
  }, [open, refreshWishlist, isLoggedIn])

  if (!isLoggedIn) {
    return (
      <SideDrawer open={open} onClose={onClose} title='Yêu Thích' icon={<FavoriteIcon />}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant='h6' gutterBottom>
            Vui lòng đăng nhập để xem danh sách yêu thích
          </Typography>
          <Button variant='contained' color='primary' onClick={onLoginClick} sx={{ mt: 2 }}>
            Đăng Nhập
          </Button>
        </Box>
      </SideDrawer>
    )
  }

  return (
    <SideDrawer open={open} onClose={onClose} title='Yêu Thích' icon={<FavoriteIcon />}>
      {wishlistLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <FavoriteProductsList favoriteProducts={wishlistData?.data || []} onClose={onClose} />
      )}
    </SideDrawer>
  )
}
