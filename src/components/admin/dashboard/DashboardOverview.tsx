import { useFetchGetDashboardStatistics } from '@/hooks/apis/statistics'
import { Inventory as InventoryIcon, AttachMoney as MoneyIcon, People as PeopleIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material'
import { alpha, Box, Card, CardContent, CardHeader, CircularProgress, Grid, Stack, Theme, Typography } from '@mui/material'
import { BarChart, PieChart } from '@mui/x-charts'

const DashboardOverview = () => {
  const { data: dashboardData, isLoading } = useFetchGetDashboardStatistics()

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height={300}>
        <CircularProgress />
      </Box>
    )
  }

  // Ensure all order statuses are shown, even if they're not in the API response
  const orderStatusData = [
    { 
      id: 0, 
      value: dashboardData?.data?.orderStatusCounts?.pending || 0, 
      label: 'Đang Chờ', 
      color: '#ff9800' 
    },
    { 
      id: 1, 
      value: dashboardData?.data?.orderStatusCounts?.processing || 0, 
      label: 'Đang Xử Lý', 
      color: '#2196f3' 
    },
    { 
      id: 2, 
      value: dashboardData?.data?.orderStatusCounts?.shipping || 0, 
      label: 'Đang Giao Hàng', 
      color: '#9c27b0' 
    },
    { 
      id: 3, 
      value: dashboardData?.data?.orderStatusCounts?.delivered || 0, 
      label: 'Đã Giao Hàng', 
      color: '#4caf50' 
    },
    { 
      id: 4, 
      value: dashboardData?.data?.orderStatusCounts?.cancelled || 0, 
      label: 'Đã Hủy', 
      color: '#f44336' 
    },
    { 
      id: 5, 
      value: dashboardData?.data?.orderStatusCounts?.returned || 0, 
      label: 'Đã Trả Hàng', 
      color: '#795548' 
    }
  ];

  const cardStyle = {
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: 'primary.main',
      boxShadow: (theme: Theme) => `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`
    }
  }

  const iconStyle = {
    width: 48,
    height: 48,
    borderRadius: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
    <>
      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={cardStyle}>
            <CardContent>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Box sx={{ ...iconStyle, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}>
                  <ShoppingCartIcon color='primary' sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant='h4' component='div' fontWeight='bold'>
                    {dashboardData?.data?.totalOrders || 0}
                  </Typography>
                  <Typography color='text.secondary' variant='body2' sx={{ mt: 0.5 }}>
                    Tổng Đơn Hàng
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={cardStyle}>
            <CardContent>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Box sx={{ ...iconStyle, bgcolor: (theme) => alpha(theme.palette.success.main, 0.1) }}>
                  <PeopleIcon color='success' sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant='h4' component='div' fontWeight='bold'>
                    {dashboardData?.data?.totalUsers || 0}
                  </Typography>
                  <Typography color='text.secondary' variant='body2' sx={{ mt: 0.5 }}>
                    Tổng Người Dùng
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={cardStyle}>
            <CardContent>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Box sx={{ ...iconStyle, bgcolor: (theme) => alpha(theme.palette.info.main, 0.1) }}>
                  <InventoryIcon color='info' sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant='h4' component='div' fontWeight='bold'>
                    {dashboardData?.data?.totalProducts || 0}
                  </Typography>
                  <Typography color='text.secondary' variant='body2' sx={{ mt: 0.5 }}>
                    Tổng Sản Phẩm
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={cardStyle}>
            <CardContent>
              <Stack direction='row' spacing={2} alignItems='center'>
                <Box sx={{ ...iconStyle, bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1) }}>
                  <MoneyIcon color='warning' sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant='h4' component='div' fontWeight='bold'>
                    ${dashboardData?.data?.totalRevenue?.toLocaleString() || 0}
                  </Typography>
                  <Typography color='text.secondary' variant='body2' sx={{ mt: 0.5 }}>
                    Tổng Doanh Thu
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Status Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ ...cardStyle, height: '100%' }}>
            <CardHeader 
              title='Doanh Thu Theo Thời Gian'
              titleTypographyProps={{ 
                variant: 'h6',
                fontWeight: 'bold'
              }}
            />
            <CardContent sx={{ height: 300 }}>
              {dashboardData && (
                <BarChart
                  series={[
                    {
                      data: [dashboardData.data?.todayRevenue || 0, dashboardData.data?.monthlyRevenue || 0, dashboardData.data?.yearlyRevenue || 0],
                      label: 'Doanh Thu',
                      color: '#2196f3'
                    }
                  ]}
                  xAxis={[
                    {
                      data: ['Hôm Nay', 'Tháng', 'Năm'],
                      scaleType: 'band'
                    }
                  ]}
                  height={280}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ ...cardStyle, height: '100%' }}>
            <CardHeader 
              title='Trạng Thái Đơn Hàng'
              titleTypographyProps={{ 
                variant: 'h6',
                fontWeight: 'bold'
              }}
            />
            <CardContent>
              <PieChart
                series={[
                  {
                    data: orderStatusData,
                    innerRadius: 40,
                    outerRadius: 80,
                    paddingAngle: 2,
                    cornerRadius: 4,
                    valueFormatter: (value) => `${value.value} đơn`
                  }
                ]}
                height={220}
                slotProps={{
                  legend: {
                    direction: 'horizontal',
                    position: { vertical: 'bottom', horizontal: 'center' }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default DashboardOverview 