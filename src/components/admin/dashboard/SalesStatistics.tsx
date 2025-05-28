import LoadingWrapper from '@/components/common/LoadingWrapper'
import { useFetchGetSalesStatistics } from '@/hooks/apis/statistics'
import { useDateRangeFilter } from '@/hooks/dashboard/useDateRangeFilter'
import { OrderStatusItem, ReqSalesStatistics } from '@/types/statistics.type'
import { convertDMYToYMD, formatDate, formatDateToDMY } from '@/utils/format'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Stack, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { memo, useCallback, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import DateRangeSelector from './DateRangeSelector'

// Function to get appropriate color for order status
const getOrderStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    pending: '#ff9800', // cam
    processing: '#2196f3', // xanh dương
    shipping: '#9c27b0', // tím
    delivered: '#4caf50', // xanh lá
    canceled: '#f44336', // đỏ
    returned: '#795548' // nâu
  }
  return statusColors[status.toLowerCase()] || '#9e9e9e' // mặc định xám
}

// Map English status to Vietnamese display text
const getStatusDisplayText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    canceled: 'Đã hủy',
    returned: 'Đã trả hàng'
  }
  return statusMap[status.toLowerCase()] || status
}

// Default order statuses to ensure all are displayed
const DEFAULT_ORDER_STATUSES = [
  { status: 'pending', count: 0 },
  { status: 'processing', count: 0 },
  { status: 'shipping', count: 0 },
  { status: 'delivered', count: 0 },
  { status: 'canceled', count: 0 },
  { status: 'returned', count: 0 }
]

const SalesStatistics = () => {
  const [params] = useState<ReqSalesStatistics>({})
  const { data: salesData, isLoading } = useFetchGetSalesStatistics(params)
  
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
  } = useDateRangeFilter<{ date: string; count: number }>()

  // Process and filter data based on selected time period
  const filteredData = useMemo(() => {
    if (!salesData?.data) return null

    // Filter ordersByDate data
    const filteredOrdersByDate = filterDataByDateRange(
      salesData.data.ordersByDate,
      item => item.date
    )

    // Calculate total orders from filtered data
    const filteredTotalOrders = filteredOrdersByDate.reduce((total, item) => total + item.count, 0)

    return {
      ...salesData.data,
      totalOrders: filteredTotalOrders,
      ordersByDate: filteredOrdersByDate
    }
  }, [salesData, filterDataByDateRange])

  // Prepare order status data for display
  const orderStatusData = useMemo(() => {
    if (!filteredData) return []

    const existingStatuses = filteredData.ordersByStatus || []
    const allOrderStatuses = [...DEFAULT_ORDER_STATUSES] // Clone to avoid mutation

    // Update with actual data from API
    existingStatuses.forEach((statusItem: OrderStatusItem) => {
      const matchingStatus = allOrderStatuses.find(s => 
        s.status.toLowerCase() === statusItem.status.toLowerCase()
      )
      if (matchingStatus) {
        matchingStatus.count = statusItem.count
      }
    })

    // Create series for chart
    return allOrderStatuses.map(item => ({
      data: [item.count],
      label: getStatusDisplayText(item.status),
      color: getOrderStatusColor(item.status)
    }))
  }, [filteredData])

  // Handle Excel export
  const exportToExcel = useCallback(() => {
    if (!filteredData) return

    // Prepare data for export
    const orderStatusData = filteredData.ordersByStatus.map(item => ({
      'Trạng Thái': getStatusDisplayText(item.status),
      'Số Lượng': item.count
    }))

    const ordersByDateData = filteredData.ordersByDate.map(item => ({
      'Ngày': convertDMYToYMD(item.date),
      'Số Đơn Hàng': item.count
    }))

    // Create workbook and worksheets
    const wb = XLSX.utils.book_new()

    const wsOrders = XLSX.utils.json_to_sheet([
      { 'Tổng Đơn Hàng': filteredData.totalOrders }, 
      { 'Thời Gian Từ': formatDate(startDate) }, 
      { 'Thời Gian Đến': formatDate(endDate) }
    ])
    XLSX.utils.book_append_sheet(wb, wsOrders, 'Tổng Quan')

    const wsOrderStatus = XLSX.utils.json_to_sheet(orderStatusData)
    XLSX.utils.book_append_sheet(wb, wsOrderStatus, 'Trạng Thái Đơn Hàng')

    const wsOrdersByDate = XLSX.utils.json_to_sheet(ordersByDateData)
    XLSX.utils.book_append_sheet(wb, wsOrdersByDate, 'Đơn Hàng Theo Ngày')

    // Save file
    XLSX.writeFile(wb, 'ThongKeDonHang.xlsx')
  }, [filteredData, startDate, endDate])

  // Check if the chart data is empty
  const isOrdersByDateEmpty = !filteredData?.ordersByDate || filteredData.ordersByDate.length === 0

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
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title='Đơn Hàng Theo Trạng Thái' />
            <CardContent>
              <BarChart
                xAxis={[{
                  scaleType: 'band',
                  data: ['Trạng Thái Đơn Hàng']
                }]}
                series={orderStatusData}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title='Tổng Kết Đơn Hàng' />
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant='subtitle1'>Tổng Đơn Hàng</Typography>
                  <Typography variant='h5' color='primary'>
                    {filteredData?.totalOrders || 0}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant='subtitle1'>Đơn Hàng Theo Ngày</Typography>
                  <Typography variant='body1'>
                    {filteredData?.ordersByDate?.length 
                      ? `${filteredData.ordersByDate[0].count} đơn hàng vào ${filteredData.ordersByDate[0].date}` 
                      : 'Không có dữ liệu'}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant='subtitle1'>Thời Gian Thống Kê</Typography>
                  <Typography variant='body1'>{`Từ ${formatDateToDMY(startDate)} đến ${formatDateToDMY(endDate)}`}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ đơn hàng theo ngày */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Đơn Hàng Theo Ngày' />
            <CardContent sx={{ height: 350 }}>
              <LoadingWrapper isLoading={false} isEmpty={isOrdersByDateEmpty} height={300} emptyMessage="Không có dữ liệu trong khoảng thời gian này">
                <BarChart
                  xAxis={[{
                    scaleType: 'band',
                    data: filteredData?.ordersByDate.map(item => item.date) || []
                  }]}
                  series={[{
                    data: filteredData?.ordersByDate.map(item => item.count) || [],
                    label: 'Số Đơn Hàng',
                    color: '#2196f3'
                  }]}
                  height={300}
                />
              </LoadingWrapper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LoadingWrapper>
  )
}

export default memo(SalesStatistics)
