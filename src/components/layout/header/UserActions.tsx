'use client'

import NotificationMenu from '@/components/common/NotificationMenu'
import { useFetchGetCart } from '@/hooks/apis/cart'
import { useFetchWishlist } from '@/hooks/apis/wishlist'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PersonIcon from '@mui/icons-material/Person'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Badge, Box, IconButton, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import ClientProfileMenu from './client-profile-menu'

interface UserActionsProps {
  isLoggedIn: boolean
  openLoginPopup: () => void
  openCartPopup: () => void
  openFavoritesPopup: () => void
}

/**
 * Component that handles user action icons in the header
 * Shows profile, favorites and cart icons
 */
export default function UserActions({ isLoggedIn, openLoginPopup, openCartPopup, openFavoritesPopup }: UserActionsProps) {
  const { data: getListWishlist } = useFetchWishlist()
  const { data: getCart } = useFetchGetCart()
  const [wishlistCount, setWishlistCount] = useState(0)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (getListWishlist?.data) {
      setWishlistCount(getListWishlist.data.length || 0)
    }
  }, [getListWishlist])

  useEffect(() => {
    if (getCart?.data) {
      setCartCount(getCart.data.totalQuantity || 0)
    }
  }, [getCart])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {isLoggedIn ? (
        // Logged in state - show all icons
        <>
          <NotificationMenu />
          <Tooltip title='Favorites'>
            <IconButton color='inherit' sx={{ ml: 1 }} onClick={openFavoritesPopup}>
              <Badge badgeContent={wishlistCount} color='primary' showZero>
                <FavoriteIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title='Shopping Cart'>
            <IconButton color='inherit' sx={{ ml: 1 }} onClick={openCartPopup}>
              <Badge badgeContent={cartCount} color='primary' showZero>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <ClientProfileMenu />
        </>
      ) : (
        // Not logged in state - show only account icon
        <Tooltip title='Login / Sign Up'>
          <IconButton color='inherit' sx={{ ml: 1 }} onClick={openLoginPopup}>
            <PersonIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}
