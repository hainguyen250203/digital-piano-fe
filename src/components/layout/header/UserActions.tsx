'use client'

import NotificationMenu from '@/components/common/NotificationMenu'
import { useFetchGetCart } from '@/hooks/apis/cart'
import { useFetchWishlist } from '@/hooks/apis/wishlist'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PersonIcon from '@mui/icons-material/Person'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Badge, Box, IconButton, Tooltip } from '@mui/material'
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
  const { data: Cart } = useFetchGetCart()
  const { data: Favorite } = useFetchWishlist()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {isLoggedIn ? (
        // Logged in state - show all icons
        <>
          <NotificationMenu />
          <Tooltip title='Favorites'>
            <IconButton color='inherit' sx={{ ml: 1 }} onClick={openFavoritesPopup}>
              <Badge badgeContent={Favorite?.data?.length || 0} color='primary' showZero>
                <FavoriteIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title='Shopping Cart'>
            <IconButton color='inherit' sx={{ ml: 1 }} onClick={openCartPopup}>
              <Badge badgeContent={Cart?.data.totalQuantity || 0} color='primary' showZero>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <ClientProfileMenu />
        </>
      ) : (
        // Not logged in state - show only account icon and wishlist icon (without data)
        <>
          <Tooltip title='Đăng nhập để xem danh sách yêu thích'>
            <IconButton color='inherit' sx={{ ml: 1 }} onClick={openLoginPopup}>
              <FavoriteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Login / Sign Up'>
            <IconButton color='inherit' sx={{ ml: 1 }} onClick={openLoginPopup}>
              <PersonIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  )
}
