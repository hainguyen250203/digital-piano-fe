'use client'

import { AppBar, Box, Container, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

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
  // State
  const { accessToken } = useAuthStore(state => state)
  const [openLoginPopup, setOpenLoginPopup] = useState(false)
  const [openCart, setOpenCart] = useState(false)
  const [openFavorites, setOpenFavorites] = useState(false)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Theme and responsive breakpoints
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isTabletOrSmaller = useMediaQuery(theme.breakpoints.down('md'))
  
  // Data fetching
  const { data: categoriesData, isLoading: isCategoriesLoading } = useFetchCategoryMenu()
  const categories = useMemo(() => categoriesData?.data || [], [categoriesData])

  // Effects
  useEffect(() => {
    setUserLoggedIn(!!accessToken && isAuthenticated())
  }, [accessToken])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Popup handlers
  const handleToggle = useMemo(() => ({
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
  }), [])

  if (isCategoriesLoading) {
    return <HeaderSkeleton />
  }

  return (
    <AppBar 
      position='sticky' 
      elevation={scrolled ? 3 : 0} 
      sx={{ 
        backgroundColor: 'white',
        color: 'text.primary',
        transition: 'all 0.3s ease',
        borderBottom: scrolled ? 'none' : '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth='xl'>
        {/* Header Toolbar */}
        <Toolbar 
          disableGutters 
          sx={{ 
            py: { xs: 1, sm: 1.5 }, 
            minHeight: { xs: '64px', sm: '70px' },
            transition: 'all 0.3s ease',
            gap: { xs: 1, sm: 2 }
          }}
        >
          {/* Mobile Menu Icon */}
          {isTabletOrSmaller && (
            <Box sx={{ display: 'flex', mr: 1 }}>
              <MobileMenu categories={categories as CategoryMenuData[]} />
            </Box>
          )}
          
          {/* Main Header Content */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'nowrap'
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                justifyContent: { sm: 'center', md: 'flex-start' },
                alignItems: 'center',
                height: '100%',
                flexShrink: 0,
                width: { md: '200px' }
              }}
            >
              <Link href='/' style={{ display: 'flex', alignItems: 'center' }}>
                <Image 
                  src='/logo.png' 
                  alt='Logo' 
                  width={150} 
                  height={50} 
                  style={{
                    objectFit: 'contain',
                    transition: 'transform 0.2s ease'
                  }}
                  priority
                />
              </Link>
            </Box>
            
            {/* Search Bar */}
            {!isMobile && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                width: '100%', 
                maxWidth: { sm: '400px', md: '500px', lg: '600px' },
                mx: 'auto',
                flexGrow: 1
              }}>
                <SearchBar />
              </Box>
            )}
            
            {/* User Controls */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                ml: { xs: 'auto', md: 0 },
                flexShrink: 0
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
          </Box>
        </Toolbar>
        
        {/* Desktop Menu */}
        {!isMobile && !isTablet && (
          <Box sx={{ 
            display: { xs: 'none', md: 'block' }, 
            mt: 1,
            mb: 0.5,
            transition: 'all 0.3s ease'
          }}>
            <Menu categories={categories as CategoryMenuData[]} />
          </Box>
        )}
        
        {/* Popups */}
        <LoginPopup open={openLoginPopup} onClose={handleToggle.login.close} />
        {userLoggedIn && (
          <>
            <FavoritesPopup open={openFavorites} onClose={handleToggle.favorites.close} />
            <CartPopup open={openCart} onClose={handleToggle.cart.close} />
          </>
        )}
      </Container>
    </AppBar>
  )
}
