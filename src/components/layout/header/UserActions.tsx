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
 * Component xử lý các biểu tượng hành động người dùng trong header
 * Hiển thị biểu tượng hồ sơ, yêu thích và giỏ hàng
 */
export default function UserActions({ isLoggedIn, openLoginPopup, openCartPopup, openFavoritesPopup }: UserActionsProps) {
  const { data: Cart } = useFetchGetCart()
  const { data: Favorite } = useFetchWishlist()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {isLoggedIn ? (
        // Trạng thái đã đăng nhập - hiển thị tất cả các biểu tượng
        <>
          <NotificationMenu />
          <Tooltip title='Danh sách yêu thích'>
            <IconButton color='inherit' sx={{ ml: 1 }} onClick={openFavoritesPopup}>
              <Badge badgeContent={Favorite?.data?.length || 0} color='primary' showZero>
                <FavoriteIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title='Giỏ hàng'>
            <IconButton color='inherit' sx={{ ml: 1 }} onClick={openCartPopup}>
              <Badge badgeContent={Cart?.data.totalQuantity || 0} color='primary' showZero>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <ClientProfileMenu />
        </>
      ) : (
        // Trạng thái chưa đăng nhập - chỉ hiển thị biểu tượng tài khoản và yêu thích (không có dữ liệu)
        <>
          <Tooltip title='Đăng nhập để xem danh sách yêu thích'>
            <IconButton color='inherit' sx={{ ml: 1 }} onClick={openLoginPopup}>
              <FavoriteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Đăng nhập / Đăng ký'>
            <IconButton color='inherit' sx={{ ml: 1 }} onClick={openLoginPopup}>
              <PersonIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  )
}
