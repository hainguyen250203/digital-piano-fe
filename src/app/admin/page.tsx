'use client'

import { useFetchDiscountList } from '@/hooks/apis/discount'
import { useFetchProductList } from '@/hooks/apis/product'
import { useFetchUserList } from '@/hooks/apis/user'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import GroupIcon from '@mui/icons-material/Group'
import InventoryIcon from '@mui/icons-material/Inventory'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Button, Card, Divider, Grid, Paper, Skeleton, Stack, Typography, alpha, useTheme } from '@mui/material'
import Link from 'next/link'

/**
 * Stat card component for dashboard metrics
 */
function StatCard({ title, value, icon, href, color, loading, subtitle }: { title: string; value: number; icon: React.ReactNode; href: string; color: string; loading: boolean; subtitle: string }) {
  return (
    <Card
      component={Link}
      href={href}
      elevation={0}
      sx={{
        'p': 3,
        'height': '100%',
        'display': 'flex',
        'flexDirection': 'column',
        'borderRadius': 3,
        'position': 'relative',
        'overflow': 'hidden',
        'cursor': 'pointer',
        'textDecoration': 'none',
        'transition': 'all 0.25s ease-in-out',
        'border': '1px solid',
        'borderColor': 'divider',
        '&:hover': {
          'transform': 'translateY(-5px)',
          'boxShadow': '0 10px 20px -10px rgba(0,0,0,0.1)',
          'borderColor': `${color}40`,
          '& .arrow-icon': {
            transform: 'translateX(4px)',
            opacity: 1
          }
        }
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          right: -20,
          top: -20,
          width: 110,
          height: 110,
          borderRadius: '50%',
          bgcolor: alpha(color, 0.1),
          zIndex: 0
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Icon */}
        <Box
          sx={{
            display: 'inline-flex',
            p: 1.25,
            borderRadius: 2,
            bgcolor: alpha(color, 0.12),
            color: color,
            mb: 2
          }}
        >
          {icon}
        </Box>

        {/* Title & value */}
        <Stack direction='column' spacing={0.5} sx={{ flexGrow: 1 }}>
          <Typography variant='h6' color='text.secondary' fontWeight={500}>
            {title}
          </Typography>

          {loading ? (
            <Box sx={{ my: 1.5 }}>
              <Skeleton variant='rectangular' width='60%' height={42} animation='wave' />
            </Box>
          ) : (
            <Typography variant='h3' fontWeight='700' sx={{ mb: 0.5 }}>
              {value.toLocaleString()}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Typography variant='body2' color='text.secondary'>
              {subtitle}
            </Typography>
            <ArrowForwardIcon
              className='arrow-icon'
              fontSize='small'
              sx={{
                color: color,
                transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
                opacity: 0.5
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Card>
  )
}

/**
 * Admin dashboard page component
 */
export default function AdminDashboardPage() {
  const theme = useTheme()

  // Fetch data for statistics
  const { data: usersData, isLoading: isLoadingUsers } = useFetchUserList()
  const { data: productsData, isLoading: isLoadingProducts } = useFetchProductList()
  const { data: discountsData, isLoading: isLoadingDiscounts } = useFetchDiscountList()

  // Calculate stats directly
  const totalUsers = usersData?.data?.length || 0
  const totalProducts = productsData?.data?.length || 0
  const totalDiscounts = discountsData?.data?.length || 0
  const activeDiscounts =
    discountsData?.data?.filter(discount => {
      if (!discount.endDate) return false
      return new Date(discount.endDate) >= new Date()
    }).length || 0

  // Define stat cards data
  const statCards = [
    {
      title: 'Tổng Người Dùng',
      value: totalUsers,
      icon: <GroupIcon />,
      href: '/admin/users',
      color: theme.palette.primary.main,
      loading: isLoadingUsers,
      subtitle: 'Tài khoản đã đăng ký'
    },
    {
      title: 'Sản Phẩm',
      value: totalProducts,
      icon: <InventoryIcon />,
      href: '/admin/products',
      color: theme.palette.success.main,
      loading: isLoadingProducts,
      subtitle: 'Sản phẩm trong kho'
    },
    {
      title: 'Mã Giảm Giá',
      value: totalDiscounts,
      icon: <LocalOfferIcon />,
      href: '/admin/discounts',
      color: theme.palette.warning.main,
      loading: isLoadingDiscounts,
      subtitle: `${activeDiscounts} đang hoạt động`
    }
  ]

  return (
    <Box>
      <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 4 }}>
        <TrendingUpIcon fontSize='large' color='primary' />
        <Typography variant='h4' fontWeight='600'>
          Tổng Quan Bảng Điều Khiển
        </Typography>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} href={stat.href} color={stat.color} loading={stat.loading} subtitle={stat.subtitle} />
          </Grid>
        ))}
      </Grid>

      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant='h5' fontWeight={600} gutterBottom>
          Chào Mừng Đến Với Trang Quản Trị Digital Piano
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant='body1' paragraph>
          Đây là bảng điều khiển quản trị cho cửa hàng Digital Piano. Sử dụng menu điều hướng để quản lý sản phẩm, người dùng, đơn hàng và nhiều hơn nữa.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
          <Button variant='contained' color='primary' disableElevation href='/admin/products' sx={{ borderRadius: 2 }}>
            Quản Lý Sản Phẩm
          </Button>
          <Button variant='outlined' color='primary' disableElevation href='/admin/users' sx={{ borderRadius: 2 }}>
            Xem Người Dùng
          </Button>
          <Button variant='outlined' color='primary' disableElevation href='/admin/orders' sx={{ borderRadius: 2 }}>
            Kiểm Tra Đơn Hàng
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
