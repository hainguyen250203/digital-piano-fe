import { useFetchGetRevenueStatistics } from '@/hooks/apis/statistics'
import { ReqRevenueStatistics, TimePeriod } from '@/types/statistics.type'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, Stack, Typography } from '@mui/material'
import { BarChart, PieChart } from '@mui/x-charts'
import { useState } from 'react'
import * as XLSX from 'xlsx'

const RevenueStatistics = () => {
  const [params] = useState<ReqRevenueStatistics>({ period: TimePeriod.MONTH })
  const { data: revenueData, isLoading } = useFetchGetRevenueStatistics(params)

  const exportToExcel = () => {
    if (!revenueData?.data?.data) return

    // Prepare data for export
    const revenueByDateData = revenueData.data.data.revenueByDate.map(item => ({
      'Ngày': item.date,
      'Doanh Thu': item.revenue
    }))

    const revenueByPaymentMethodData = revenueData.data.data.revenueByPaymentMethod.map(item => ({
      'Phương Thức Thanh Toán': item.paymentMethod,
      'Doanh Thu': item.revenue
    }))

    const summaryData = [
      { 'Chỉ Tiêu': 'Tổng Doanh Thu', 'Giá Trị': revenueData.data.data.totalRevenue },
      { 'Chỉ Tiêu': 'Giá Trị Đơn Hàng Trung Bình', 'Giá Trị': revenueData.data.data.avgOrderValue },
      { 'Chỉ Tiêu': 'Thời Gian Từ', 'Giá Trị': revenueData.data.startDate },
      { 'Chỉ Tiêu': 'Thời Gian Đến', 'Giá Trị': revenueData.data.endDate }
    ]

    // Create workbook and worksheets
    const wb = XLSX.utils.book_new()
    
    const wsSummary = XLSX.utils.json_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng Quan')
    
    const wsRevenueByDate = XLSX.utils.json_to_sheet(revenueByDateData)
    XLSX.utils.book_append_sheet(wb, wsRevenueByDate, 'Doanh Thu Theo Ngày')
    
    const wsPaymentMethod = XLSX.utils.json_to_sheet(revenueByPaymentMethodData)
    XLSX.utils.book_append_sheet(wb, wsPaymentMethod, 'Theo Phương Thức')

    // Save file
    XLSX.writeFile(wb, 'ThongKeDoanhThu.xlsx')
  }

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height={300}>
        <CircularProgress />
      </Box>
    )
  }

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
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Tổng Quan Doanh Thu' />
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant='subtitle1'>Tổng Doanh Thu</Typography>
                      <Typography variant='h4' color='primary'>
                        ${revenueData?.data?.data.totalRevenue.toLocaleString() || 0}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant='subtitle1'>Giá Trị Trung Bình Đơn Hàng</Typography>
                      <Typography variant='h5' color='secondary'>
                        ${revenueData?.data?.data.avgOrderValue.toLocaleString() || 0}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant='subtitle1'>Thời Gian Thống Kê</Typography>
                      <Typography variant='body1'>{`Từ ${revenueData?.data?.startDate || ''} đến ${revenueData?.data?.endDate || ''}`}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant='subtitle1' gutterBottom>
                    Doanh Thu Theo Phương Thức Thanh Toán
                  </Typography>
                  <PieChart
                    series={[
                      {
                        data:
                          revenueData?.data?.data.revenueByPaymentMethod.map((item, index) => ({
                            id: index,
                            value: item.revenue,
                            label: item.paymentMethod
                          })) || [],
                        innerRadius: 30,
                        outerRadius: 100,
                        paddingAngle: 2,
                        cornerRadius: 4
                      }
                    ]}
                    height={250}
                    slotProps={{
                      legend: {
                        direction: 'vertical',
                        position: { vertical: 'middle', horizontal: 'end' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue by Date */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Doanh Thu Theo Ngày' />
            <CardContent sx={{ height: 400 }}>
              {revenueData?.data?.data.revenueByDate && revenueData.data.data.revenueByDate.length > 0 && (
                <BarChart
                  xAxis={[
                    {
                      scaleType: 'band',
                      data: revenueData.data.data.revenueByDate.map(item => item.date)
                    }
                  ]}
                  series={[
                    {
                      data: revenueData.data.data.revenueByDate.map(item => item.revenue),
                      label: 'Doanh Thu',
                      color: '#4caf50'
                    }
                  ]}
                  height={350}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default RevenueStatistics
