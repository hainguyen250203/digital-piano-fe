'use client'

import FavoriteProductsList from '@/components/popup/favorite-products-list'
import SideDrawer from '@/components/popup/SideDrawer'
import { useFetchWishlist } from '@/hooks/apis/wishlist'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Box, CircularProgress } from '@mui/material'
import React from 'react'

interface FavoritesPopupProps {
  open: boolean
  onClose: () => void
}

const FavoritesPopup: React.FC<FavoritesPopupProps> = ({ open, onClose }) => {
  const { data: getListWishlist, isLoading } = useFetchWishlist()
  const favoriteProducts = getListWishlist?.data || []

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      title={`Danh sách yêu thích (${favoriteProducts.length})`}
      icon={<FavoriteIcon />}
      iconColor='#f44336' // Error color for heart icon
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <FavoriteProductsList favoriteProducts={favoriteProducts} onClose={onClose} />
      )}
    </SideDrawer>
  )
}

export default FavoritesPopup
