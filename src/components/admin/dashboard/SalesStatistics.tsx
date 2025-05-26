import { useFetchGetSalesStatistics } from '@/hooks/apis/statistics'
import { ReqSalesStatistics, TimePeriod } from '@/types/statistics.type'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, Stack, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { useState } from 'react'
import * as XLSX from 'xlsx'

interface OrderStatusItem {
  status: string;
  count: number;
}

const SalesStatistics = () => {
  const [params] = useState<ReqSalesStatistics>({ period: TimePeriod.MONTH })
  const { data: salesData, isLoading } = useFetchGetSalesStatistics(params)

  // Function to get appropriate color for order status
  const getOrderStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      'pending': '#ff9800',      // cam
      'processing': '#2196f3',   // xanh dương
      'shipping': '#9c27b0',     // tím
      'delivered': '#4caf50',    // xanh lá
      'canceled': '#f44336',     // đỏ
      'returned': '#795548'      // nâu
    }
    return statusColors[status.toLowerCase()] || '#9e9e9e' // mặc định xám
  }

  // Map English status to Vietnamese display text
  const getStatusDisplayText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'shipping': 'Đang giao hàng',
      'delivered': 'Đã giao hàng',
      'canceled': 'Đã hủy',
      'returned': 'Đã trả hàng'
    }
    return statusMap[status.toLowerCase()] || status
  }

  const exportToExcel = () => {
    if (!salesData?.data?.data) return

    // Prepare data for export
    const orderStatusData = salesData.data.data.ordersByStatus.map(item => ({
      'Trạng Thái': getStatusDisplayText(item.status),
      'Số Lượng': item.count
    }))

    const ordersByDateData = salesData.data.data.ordersByDate.map(item => ({
      'Ngày': item.date,
      'Số Đơn Hàng': item.count
    }))

    // Create workbook and worksheets
    const wb = XLSX.utils.book_new()
    
    const wsOrders = XLSX.utils.json_to_sheet([
      { 'Tổng Đơn Hàng': salesData.data.data.totalOrders },
      { 'Thời Gian Từ': salesData.data.startDate },
      { 'Thời Gian Đến': salesData.data.endDate }
    ])
    XLSX.utils.book_append_sheet(wb, wsOrders, 'Tổng Quan')
    
    const wsOrderStatus = XLSX.utils.json_to_sheet(orderStatusData)
    XLSX.utils.book_append_sheet(wb, wsOrderStatus, 'Trạng Thái Đơn Hàng')
    
    const wsOrdersByDate = XLSX.utils.json_to_sheet(ordersByDateData)
    XLSX.utils.book_append_sheet(wb, wsOrdersByDate, 'Đơn Hàng Theo Ngày')

    // Save file
    XLSX.writeFile(wb, 'ThongKeDonHang.xlsx')
  }

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height={300}>
        <CircularProgress />
      </Box>
    )
  }

  // Lấy dữ liệu trạng thái từ API
  const existingStatuses = salesData?.data?.data?.ordersByStatus || [] as OrderStatusItem[];

  // Đảm bảo tất cả trạng thái được hiển thị
  const allOrderStatuses = [
    { status: 'pending', count: 0 },
    { status: 'processing', count: 0 },
    { status: 'shipping', count: 0 },
    { status: 'delivered', count: 0 },
    { status: 'canceled', count: 0 },
    { status: 'returned', count: 0 }
  ];

  // Cập nhật với dữ liệu thực từ API
  existingStatuses.forEach((statusItem: OrderStatusItem) => {
    const matchingStatus = allOrderStatuses.find(
      s => s.status.toLowerCase() === statusItem.status.toLowerCase()
    );
    if (matchingStatus) {
      matchingStatus.count = statusItem.count;
    }
  });

  // Tạo series cho biểu đồ
  const orderStatusSeries = allOrderStatuses.map(item => ({
    data: [item.count],
    label: getStatusDisplayText(item.status),
    color: getOrderStatusColor(item.status)
  }));

  return (
    <>
      <Box mb={3} display='flex' justifyContent='flex-end'>
        <Button 
          variant='contained' 
          color='success' 
          startIcon={<FileDownloadIcon />} 
          onClick={exportToExcel}
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
                xAxis={[
                  {
                    scaleType: 'band',
                    data: ['Trạng Thái Đơn Hàng']
                  }
                ]}
                series={orderStatusSeries}
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
                    {salesData?.data?.data?.totalOrders || 0}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant='subtitle1'>Đơn Hàng Theo Ngày</Typography>
                  <Typography variant='body1'>
                    {salesData?.data?.data?.ordersByDate?.length 
                      ? `${salesData.data.data.ordersByDate[0].count} đơn hàng vào ${salesData.data.data.ordersByDate[0].date}`
                      : 'Không có dữ liệu'}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant='subtitle1'>Thời Gian Thống Kê</Typography>
                  <Typography variant='body1'>
                    {`Từ ${salesData?.data?.startDate || ''} đến ${salesData?.data?.endDate || ''}`}
                  </Typography>
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
              {salesData?.data?.data?.ordersByDate && salesData.data.data.ordersByDate.length > 0 && (
                <BarChart
                  xAxis={[
                    {
                      scaleType: 'band',
                      data: salesData.data.data.ordersByDate.map((item: { date: string; count: number }) => item.date)
                    }
                  ]}
                  series={[
                    {
                      data: salesData.data.data.ordersByDate.map((item: { date: string; count: number }) => item.count),
                      label: 'Số Đơn Hàng',
                      color: '#2196f3'
                    }
                  ]}
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default SalesStatistics 