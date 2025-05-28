import LoadingWrapper from '@/components/common/LoadingWrapper'
import { useFetchGetUserStatistics } from '@/hooks/apis/statistics'
import { useDateRangeFilter } from '@/hooks/dashboard/useDateRangeFilter'
import { ReqUserStatistics } from '@/types/statistics.type'
import { convertDMYToYMD, formatCurrency, formatDate, formatDateToDMY } from '@/utils/format'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Typography
} from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { memo, useCallback, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import DateRangeSelector from './DateRangeSelector'

// Interface for user date data
interface UserDateItem {
  date: string;
  count: number;
}

// Interface for customer data
interface CustomerData {
  id?: string | number;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  orderCount?: number;
  totalSpending?: number;
}

// Avatar style for consistency
const avatarStyle = {
  width: 48,
  height: 48,
  border: '2px solid #fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}

// Memoized customer list item component
const CustomerListItem = memo(({ 
  customer, 
  index, 
  valueLabel 
}: { 
  customer: CustomerData; 
  index: number; 
  valueLabel: string | number;
}) => (
  <ListItem divider={index < 4}>
    <ListItemAvatar>
      <Avatar 
        src={customer.avatarUrl} 
        alt={customer.email} 
        sx={avatarStyle}
      >
        {customer.email.charAt(0).toUpperCase()}
      </Avatar>
    </ListItemAvatar>
    <ListItemText 
      primary={
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body1" fontWeight="medium">{customer.email}</Typography>
          <Typography variant="body1" fontWeight="bold" color="primary">
            {valueLabel}
          </Typography>
        </Box>
      }
      secondary={customer.phoneNumber || 'Không có số điện thoại'}
    />
  </ListItem>
))

CustomerListItem.displayName = 'CustomerListItem'

const UserStatistics = () => {
  const [params] = useState<ReqUserStatistics>({})
  const { data: userData, isLoading } = useFetchGetUserStatistics(params)
  
  // Use the custom hook for date range filtering
  const {
    period,
    startDate,
    endDate,
    startCustomDate,
    endCustomDate,
    handlePeriodChange,
    setStartCustomDate,
    setEndCustomDate,
    filterDataByDateRange
  } = useDateRangeFilter<UserDateItem>()

  // Process and filter data based on selected time period
  const filteredData = useMemo(() => {
    if (!userData?.data) return null

    // Filter newUsersByDate data
    const filteredNewUsersByDate = filterDataByDateRange(
      userData.data.newUsersByDate,
      item => item.date
    )

    // Calculate total new users from filtered data
    const filteredTotalNewUsers = filteredNewUsersByDate.reduce((total, item) => total + item.count, 0)

    return {
      ...userData.data,
      totalNewUsers: filteredTotalNewUsers,
      newUsersByDate: filteredNewUsersByDate
    }
  }, [userData, filterDataByDateRange])

  // Export data to Excel
  const exportToExcel = useCallback(() => {
    if (!filteredData) return

    // Prepare data for export
    const newUsersByDateData = filteredData.newUsersByDate.map(item => ({
      'Ngày': convertDMYToYMD(item.date),
      'Số Người Dùng Mới': item.count
    }))

    const topCustomersByOrderCountData = filteredData.topCustomersByOrderCount.map(item => ({
      'Email': item.email,
      'Số Điện Thoại': item.phoneNumber || 'N/A',
      'Số Đơn Hàng': item.orderCount
    }))

    const topCustomersBySpendingData = filteredData.topCustomersBySpending.map(item => ({
      'Email': item.email,
      'Số Điện Thoại': item.phoneNumber || 'N/A',
      'Tổng Chi Tiêu': item.totalSpending
    }))

    // Create workbook and worksheets
    const wb = XLSX.utils.book_new()

    const wsSummary = XLSX.utils.json_to_sheet([
      { 'Chỉ Tiêu': 'Tổng Người Dùng Mới', 'Giá Trị': filteredData.totalNewUsers },
      { 'Chỉ Tiêu': 'Tổng Người Dùng Hoạt Động', 'Giá Trị': filteredData.totalActiveUsers },
      { 'Chỉ Tiêu': 'Thời Gian Từ', 'Giá Trị': formatDate(startDate) },
      { 'Chỉ Tiêu': 'Thời Gian Đến', 'Giá Trị': formatDate(endDate) }
    ])
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng Quan')

    const wsNewUsers = XLSX.utils.json_to_sheet(newUsersByDateData)
    XLSX.utils.book_append_sheet(wb, wsNewUsers, 'Người Dùng Mới Theo Ngày')

    const wsTopByOrders = XLSX.utils.json_to_sheet(topCustomersByOrderCountData)
    XLSX.utils.book_append_sheet(wb, wsTopByOrders, 'Khách Hàng Theo Đơn Hàng')

    const wsTopBySpending = XLSX.utils.json_to_sheet(topCustomersBySpendingData)
    XLSX.utils.book_append_sheet(wb, wsTopBySpending, 'Khách Hàng Theo Chi Tiêu')

    // Save file
    XLSX.writeFile(wb, 'ThongKeNguoiDung.xlsx')
  }, [filteredData, startDate, endDate])

  // Check if chart data is empty
  const isChartEmpty = !filteredData?.newUsersByDate || filteredData.newUsersByDate.length === 0
  const hasTopCustomers = filteredData?.topCustomersBySpending && filteredData.topCustomersBySpending.length > 0

  return (
    <LoadingWrapper isLoading={isLoading}>
      <Box mb={3} display='flex' justifyContent='space-between' alignItems='center'>
        <DateRangeSelector
          period={period}
          onPeriodChange={handlePeriodChange}
          startCustomDate={startCustomDate}
          endCustomDate={endCustomDate}
          onStartDateChange={setStartCustomDate}
          onEndDateChange={setEndCustomDate}
        />
        <Button 
          variant='contained' 
          color='success' 
          startIcon={<FileDownloadIcon />} 
          onClick={exportToExcel}
          disabled={!filteredData}
        >
          Xuất Excel
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* User Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title='Tổng Quan Người Dùng' />
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant='subtitle1'>Tổng Người Dùng Mới</Typography>
                  <Typography variant='h4' color='primary'>
                    {filteredData?.totalNewUsers || 0}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant='subtitle1'>Tổng Người Dùng Hoạt Động</Typography>
                  <Typography variant='h4' color='secondary'>
                    {filteredData?.totalActiveUsers || 0}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant='subtitle1'>Thời Gian Thống Kê</Typography>
                  <Typography variant='body1'>{`Từ ${formatDateToDMY(startDate)} đến ${formatDateToDMY(endDate)}`}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant='subtitle1'>Khách Hàng Hàng Đầu</Typography>
                  <AvatarGroup max={5} sx={{ justifyContent: 'center', mt: 1 }}>
                    {hasTopCustomers && filteredData.topCustomersBySpending.slice(0, 5).map((customer, index) => (
                      <Avatar 
                        key={index} 
                        src={customer.avatarUrl} 
                        alt={customer.email} 
                        sx={avatarStyle}
                      >
                        {customer.email.charAt(0).toUpperCase()}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* New Users Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title='Người Dùng Mới Theo Ngày' />
            <CardContent sx={{ height: 340 }}>
              <LoadingWrapper isLoading={false} isEmpty={isChartEmpty} height={320} emptyMessage="Không có dữ liệu trong khoảng thời gian này">
                <BarChart
                  xAxis={[{
                    scaleType: 'band',
                    data: filteredData?.newUsersByDate.map(item => item.date) || []
                  }]}
                  series={[{
                    data: filteredData?.newUsersByDate.map(item => item.count) || [],
                    label: 'Người Dùng Mới',
                    color: '#4caf50'
                  }]}
                  height={320}
                />
              </LoadingWrapper>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Customers By Order Count */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title='Top 5 Khách Hàng Theo Số Đơn Hàng' />
            <CardContent>
              <List>
                {filteredData?.topCustomersByOrderCount.slice(0, 5).map((customer, index) => (
                  <CustomerListItem 
                    key={customer.id || index}
                    customer={customer} 
                    index={index} 
                    valueLabel={`${customer.orderCount} đơn`}
                  />
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Customers By Spending */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title='Top 5 Khách Hàng Theo Chi Tiêu' />
            <CardContent>
              <List>
                {filteredData?.topCustomersBySpending.slice(0, 5).map((customer, index) => (
                  <CustomerListItem 
                    key={customer.id || index}
                    customer={customer} 
                    index={index} 
                    valueLabel={formatCurrency(customer.totalSpending)}
                  />
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LoadingWrapper>
  )
}

export default memo(UserStatistics) 