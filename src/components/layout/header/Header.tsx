'use client'

import { AppBar, Box, Container, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import LoginButton from '@/components/layout/header/LoginButton'
import SearchBar from '@/components/layout/header/SearchBar'
import UserActions from '@/components/layout/header/UserActions'
import Menu from '@/components/layout/menu/Menu'
import MobileMenu from '@/components/layout/menu/MobileMenu'
import CartPopup from '@/components/popup/CartPopup'
import FavoritesPopup from '@/components/popup/FavoritesPopup'
import LoginPopup from '@/components/popup/LoginPopup'
import HeaderSkeleton from './HeaderSkeleton'

import { useAuthStore } from '@/context/AuthStoreContext'
import { CategoryMenuData, useFetchCategoryMenu } from '@/hooks/apis/category'
import { isAuthenticated } from '@/utils/auth'

export default function Header() {
  const { accessToken } = useAuthStore(state => state)
  const [openLoginPopup, setOpenLoginPopup] = useState(false)
  const [openCart, setOpenCart] = useState(false)
  const [openFavorites, setOpenFavorites] = useState(false)
  const [userLoggedIn, setUserLoggedIn] = useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isTabletOrSmaller = useMediaQuery(theme.breakpoints.down('md'))
  const { data: categoriesData, isLoading: isCategoriesLoading } = useFetchCategoryMenu()
  const categories = categoriesData?.data || []

  // Check login status
  useEffect(() => {
    setUserLoggedIn(!!accessToken && isAuthenticated())
  }, [accessToken])

  // Handlers
  const handleToggle = {
    login: {
      open: () => setOpenLoginPopup(true),
      close: () => setOpenLoginPopup(false)
    },
    cart: {
      open: () => setOpenCart(true),
      close: () => setOpenCart(false)
    },
    favorites: {
      open: () => setOpenFavorites(true),
      close: () => setOpenFavorites(false)
    }
  }

  if (isCategoriesLoading) {
    return <HeaderSkeleton />
  }

  const renderLogo = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: { xs: 'center', md: 'flex-start' }
      }}
    >
      <Link href='/' style={{ display: 'flex' }}>
        <Image src='/logo.png' alt='Logo' width={150} height={50} />
      </Link>
    </Box>
  )

  const renderSearchBar = () =>
    !isMobile && (
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <SearchBar />
      </Box>
    )

  const renderUserControls = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        ml: { xs: 'auto', md: 0 }
      }}
    >
      {userLoggedIn ? (
        <UserActions 
          isLoggedIn 
          openLoginPopup={handleToggle.login.open} 
          openCartPopup={handleToggle.cart.open} 
          openFavoritesPopup={handleToggle.favorites.open} 
        />
      ) : (
        <LoginButton onClick={handleToggle.login.open} />
      )}
    </Box>
  )

  const renderMobileMenu = () =>
    isTabletOrSmaller && (
      <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' }, mr: 1 }}>
        <MobileMenu categories={categories as CategoryMenuData[]} />
      </Box>
    )

  const renderDesktopMenu = () =>
    !isMobile &&
    !isTablet && (
      <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 1 }}>
        <Menu categories={categories as CategoryMenuData[]} />
      </Box>
    )

  const renderPopups = () => (
    <>
      <LoginPopup open={openLoginPopup} onClose={handleToggle.login.close} />
      {userLoggedIn && (
        <>
          <FavoritesPopup open={openFavorites} onClose={handleToggle.favorites.close} />
          <CartPopup open={openCart} onClose={handleToggle.cart.close} />
        </>
      )}
    </>
  )

  return (
    <AppBar position='sticky' elevation={0} sx={{ backgroundColor: '#f9f9f9', color: 'text.primary' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ py: 1, minHeight: { xs: '64px', sm: '70px' } }}>
          {renderMobileMenu()}
          <Box
            sx={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: {
                xs: 'auto 1fr auto', // mobile
                sm: 'auto 1fr auto auto', // tablet: menu | logo | search | actions
                md: '200px minmax(0, 1fr) auto' // desktop
              },
              alignItems: 'center',
              gap: { xs: 1, sm: 2 }
            }}
          >
            {renderLogo()}
            {renderSearchBar()}
            {renderUserControls()}
          </Box>
        </Toolbar>
        {renderDesktopMenu()}
        {renderPopups()}
      </Container>
    </AppBar>
  )
}
