'use client'

import UserProfileMenu from '@/components/admin/header/user-profile-menu'
import { getUserRole, hasAdminAccess, isAuthenticated } from '@/utils/auth'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

import NotificationMenu from '@/components/common/NotificationMenu'
import {
  AssignmentReturn as AssignmentReturnIcon,
  ShoppingCart as CartIcon,
  Category as CategoryIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  LocalOffer as DiscountIcon,
  Inventory as InventoryIcon,
  Menu as MenuIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material'
import {
  AppBar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

const drawerWidth = 240

// Define the navigation links and their access permissions
const navLinks = [
  { label: 'Trang chủ', icon: <DashboardIcon />, href: '/admin', allowedRoles: ['ADMIN', 'STAFF'] },
  { label: 'Quản lý thực thể', icon: <CategoryIcon />, href: '/admin/entity-management', allowedRoles: ['ADMIN'] },
  { label: 'Sản phẩm', icon: <InventoryIcon />, href: '/admin/products', allowedRoles: ['ADMIN', 'STAFF'] },
  { label: 'Người dùng', icon: <PeopleIcon />, href: '/admin/users', allowedRoles: ['ADMIN'] },
  { label: 'Đơn hàng', icon: <CartIcon />, href: '/admin/orders', allowedRoles: ['ADMIN', 'STAFF'] },
  { label: 'Hóa đơn', icon: <ReceiptIcon />, href: '/admin/invoices', allowedRoles: ['ADMIN', 'STAFF'] },
  { label: 'Giảm giá', icon: <DiscountIcon />, href: '/admin/discounts', allowedRoles: ['ADMIN'] },
  { label: 'Lịch sử trả hàng', icon: <AssignmentReturnIcon />, href: '/admin/returns', allowedRoles: ['ADMIN', 'STAFF'] }
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Memoize navigation item for performance
const NavItem = memo(({ label, icon, isActive, onClick }: { label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void }) => (
  <ListItem disablePadding sx={{ mb: 0.5 }}>
    <ListItemButton
      selected={isActive}
      onClick={onClick}
      sx={{
        'borderRadius': 1,
        'mx': 1,
        '&.Mui-selected': {
          'bgcolor': 'rgba(25, 118, 210, 0.08)',
          'borderLeft': '3px solid #1976d2',
          '&:hover': {
            bgcolor: 'rgba(25, 118, 210, 0.12)'
          }
        },
        '&:hover': {
          bgcolor: 'rgba(0, 0, 0, 0.04)'
        },
        'transition': 'background-color 0.2s ease'
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 40,
          color: isActive ? 'primary.main' : 'inherit'
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontWeight: isActive ? 600 : 400,
          variant: 'body2'
        }}
      />
    </ListItemButton>
  </ListItem>
))

NavItem.displayName = 'NavItem'

function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [userRoleState, setUserRoleState] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Close drawer on mobile by default
  useEffect(() => {
    if (isMobile) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [isMobile])

  // Initialize component and check authentication
  useEffect(() => {
    setMounted(true)

    // Only run authentication checks on client-side
    if (typeof window === 'undefined') return

    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/admin/login')
      return
    }

    // Check if user has admin access
    if (!hasAdminAccess()) {
      router.push('/admin/login')
      return
    }

    // Get user role
    const role = getUserRole()
    setUserRoleState(role)
    setLoading(false)
  }, [router])

  // Check access rights for current path
  useEffect(() => {
    if (!mounted || !userRoleState) return

    const currentPage = navLinks.find(link => link.href === pathname)
    if (currentPage && !currentPage.allowedRoles.includes(userRoleState)) {
      // Redirect to the dashboard if user doesn't have permission
      router.push('/admin')
    }
  }, [pathname, userRoleState, router, mounted])

  const handleDrawerToggle = useCallback(() => {
    setOpen(prevOpen => !prevOpen)
  }, [])

  const navigateTo = useCallback(
    (href: string) => {
      router.push(href)
      if (isMobile) {
        setOpen(false)
      }
    },
    [router, isMobile]
  )

  // Filter navigation links based on user role - memoized for performance
  const filteredNavLinks = useMemo(() => navLinks.filter(link => userRoleState && link.allowedRoles.includes(userRoleState)), [userRoleState])

  const drawer = useMemo(
    () => (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            height: '64px'
          }}
        >
          <Typography variant='subtitle1' color='primary.main' fontWeight={600}>
            Digital Piano
          </Typography>
          <IconButton onClick={handleDrawerToggle} size='small'>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />

        {userRoleState && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
                p: 1,
                borderRadius: 1,
                bgcolor: 'rgba(25, 118, 210, 0.04)'
              }}
            >
              <AccountCircleIcon color='primary' />
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Đăng nhập với
                </Typography>
                <Typography variant='body2' fontWeight={500}>
                  {userRoleState}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Divider />

        <List
          sx={{
            'pt': 1,
            'flexGrow': 1,
            'overflowY': 'auto',
            'scrollbarWidth': 'thin',
            '&::-webkit-scrollbar': {
              width: '4px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px'
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            filteredNavLinks.map(({ label, icon, href }) => <NavItem key={href} label={label} icon={icon} isActive={pathname === href} onClick={() => navigateTo(href)} />)
          )}
        </List>

        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant='caption' color='text.secondary'>
            © {new Date().getFullYear()} Digital Piano
          </Typography>
        </Box>
      </Box>
    ),
    [filteredNavLinks, handleDrawerToggle, loading, navigateTo, pathname, userRoleState]
  )

  // Show loading state during initial mount
  if (!mounted || loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position='fixed'
        elevation={0}
        sx={{
          width: { xs: '100%', md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { xs: 0, md: open ? `${drawerWidth}px` : 0 },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          }),
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar
          sx={{
            height: { xs: 56, md: 64 },
            px: { xs: 1, md: 2 },
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {(!open || isMobile) && (
              <IconButton color='inherit' onClick={handleDrawerToggle} edge='start' sx={{ mr: 2 }} aria-label='open drawer'>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant='h6' noWrap color='primary.main' fontWeight={500}>
              {userRoleState === 'ADMIN' ? 'Digital Piano Quản trị' : 'Digital Piano Nhân viên'}
            </Typography>
            {userRoleState && <Chip size='small' label={userRoleState} color='primary' variant='outlined' sx={{ ml: 2 }} />}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationMenu />
            <UserProfileMenu />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        ModalProps={{
          keepMounted: true // Better mobile performance
        }}
        PaperProps={{
          sx: {
            width: drawerWidth,
            border: 'none',
            boxShadow: isMobile ? 3 : 0,
            backgroundImage: 'none',
            borderRight: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { xs: 0, md: open ? `${drawerWidth}px` : 0 },
          p: { xs: 2, md: 3 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          }),
          pt: { xs: 8, md: 10 }, // Extra space for fixed AppBar
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default'
        }}
      >
        <Fade in={true} timeout={500}>
          <Box sx={{ flexGrow: 1 }}>{children}</Box>
        </Fade>
      </Box>
    </Box>
  )
}

// Export memoized component for better performance
export default memo(DashboardLayout)
