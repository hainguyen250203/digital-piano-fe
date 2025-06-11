'use client'

import FavoriteProductsList from '@/components/popup/favorite-products-list'
import SideDrawer from '@/components/popup/SideDrawer'
import { useFetchWishlist } from '@/hooks/apis/wishlist'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Box, CircularProgress } from '@mui/material'
import { useEffect } from 'react'

interface FavoritesPopupProps {
  open: boolean
  onClose: () => void
}

export default function FavoritesPopup({ open, onClose }: FavoritesPopupProps) {
  const { data: wishlistData, isLoading: wishlistLoading, refetch: refreshWishlist } = useFetchWishlist()

  // Refresh wishlist data when the popup opens
  useEffect(() => {
    if (open) {
      refreshWishlist()
    }
  }, [open, refreshWishlist])

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
