import LoadingWrapper from '@/components/common/LoadingWrapper'
import { useFetchGetRevenueStatistics } from '@/hooks/apis/statistics'
import { useDateRangeFilter } from '@/hooks/dashboard/useDateRangeFilter'
import { ReqRevenueStatistics } from '@/types/statistics.type'
import { convertDMYToYMD, formatCurrency, formatDate, formatDateToDMY } from '@/utils/format'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Stack, Typography } from '@mui/material'
import { BarChart, PieChart } from '@mui/x-charts'
import { memo, useCallback, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import DateRangeSelector from './DateRangeSelector'

// Color mapping for payment methods
const PAYMENT_METHOD_COLORS: Record<string, string> = {
  cash: '#4caf50', // green
  vnpay: '#2196f3', // blue
  momo: '#e91e63', // pink
  zalopay: '#9c27b0', // purple
  paypal: '#ff9800' // orange
}

// Map payment methods to display names
const PAYMENT_METHOD_NAMES: Record<string, string> = {
  cash: 'Tiền mặt',
  vnpay: 'VNPay',
  momo: 'MoMo',
  zalopay: 'ZaloPay',
  paypal: 'PayPal'
}

// Interface for revenue data items
interface RevenueDataItem {
  date: string;
  [key: string]: string | number;
}

const RevenueStatistics = () => {
  const [params] = useState<ReqRevenueStatistics>({})
  const { data: revenueData, isLoading } = useFetchGetRevenueStatistics(params)
  
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
  } = useDateRangeFilter<RevenueDataItem>()

  // Process and filter data based on selected time period
  const processedData = useMemo(() => {
    if (!revenueData?.data?.revenueByDate) return null

    // Filter revenueByDate data
    const filteredRevenueByDate = filterDataByDateRange(
      revenueData.data.revenueByDate,
      item => item.date
    )

    // Get all unique payment methods from the data
    const paymentMethods = new Set<string>()
    filteredRevenueByDate.forEach(dayData => {
      Object.keys(dayData).forEach(key => {
        if (key !== 'date' && typeof dayData[key] === 'number') {
          paymentMethods.add(key)
        }
      })
    })

    // Calculate totals by payment method
    const totalsByPaymentMethod: Record<string, number> = {}
    const allPaymentMethods = Array.from(paymentMethods)
    
    allPaymentMethods.forEach(method => {
      totalsByPaymentMethod[method] = filteredRevenueByDate.reduce((sum, day) => {
        return sum + (day[method] as number || 0)
      }, 0)
    })

    // Calculate overall total
    const totalRevenue = Object.values(totalsByPaymentMethod).reduce((sum, value) => sum + value, 0)
    
    // Format data for pie chart
    const pieChartData = allPaymentMethods.map((method, index) => ({
      id: index,
      value: totalsByPaymentMethod[method],
      label: PAYMENT_METHOD_NAMES[method] || method,
      color: PAYMENT_METHOD_COLORS[method] || undefined
    }))

    // Prepare series data for stacked bar chart
    const barChartSeries = allPaymentMethods.map(method => ({
      data: filteredRevenueByDate.map(day => day[method] as number || 0),
      label: PAYMENT_METHOD_NAMES[method] || method,
      color: PAYMENT_METHOD_COLORS[method],
      stack: 'total'
    }))

    return {
      revenueByDate: filteredRevenueByDate,
      totalRevenue,
      totalsByPaymentMethod,
      paymentMethods: allPaymentMethods,
      pieChartData,
      barChartSeries
    }
  }, [revenueData, filterDataByDateRange])

  // Export data to Excel
  const exportToExcel = useCallback(() => {
    if (!processedData) return

    // Prepare data for export
    const revenueByDateData = processedData.revenueByDate.map(dayData => {
      const formattedDay: Record<string, string | number> = {
        'Ngày': convertDMYToYMD(dayData.date), // Convert the DD-MM-YYYY date to YYYY-MM-DD
        'Tổng Doanh Thu': processedData.paymentMethods.reduce((sum, method) => sum + (dayData[method] as number || 0), 0)
      }
      
      // Add columns for each payment method
      processedData.paymentMethods.forEach(method => {
        formattedDay[PAYMENT_METHOD_NAMES[method] || method] = dayData[method] || 0
      })
      
      return formattedDay
    })

    const summaryData = [
      { 'Chỉ Tiêu': 'Tổng Doanh Thu', 'Giá Trị': processedData.totalRevenue },
      { 'Chỉ Tiêu': 'Thời Gian Từ', 'Giá Trị': formatDate(startDate) },
      { 'Chỉ Tiêu': 'Thời Gian Đến', 'Giá Trị': formatDate(endDate) }
    ]

    // Add payment method breakdown to summary
    processedData.paymentMethods.forEach(method => {
      summaryData.push({
        'Chỉ Tiêu': `Doanh Thu ${PAYMENT_METHOD_NAMES[method] || method}`,
        'Giá Trị': processedData.totalsByPaymentMethod[method]
      })
    })

    // Create workbook and worksheets
    const wb = XLSX.utils.book_new()

    const wsSummary = XLSX.utils.json_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng Quan')

    const wsRevenueByDate = XLSX.utils.json_to_sheet(revenueByDateData)
    XLSX.utils.book_append_sheet(wb, wsRevenueByDate, 'Doanh Thu Theo Ngày')

    // Save file
    XLSX.writeFile(wb, 'ThongKeDoanhThu.xlsx')
  }, [processedData, startDate, endDate])

  // Check if chart data is empty
  const isPieChartEmpty = !processedData?.pieChartData || processedData.pieChartData.length === 0
  const isBarChartEmpty = !processedData?.revenueByDate || processedData.revenueByDate.length === 0

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
          disabled={!processedData}
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
                        {formatCurrency(processedData?.totalRevenue || 0)}
                      </Typography>
                    </Box>
                    <Divider />
                    {processedData?.paymentMethods.map(method => (
                      <Box key={method}>
                        <Typography variant='subtitle1'>{PAYMENT_METHOD_NAMES[method] || method}</Typography>
                        <Typography variant='h6' sx={{ color: PAYMENT_METHOD_COLORS[method] || 'text.primary' }}>
                          {formatCurrency(processedData.totalsByPaymentMethod[method] || 0)}
                        </Typography>
                      </Box>
                    ))}
                    <Divider />
                    <Box>
                      <Typography variant='subtitle1'>Thời Gian Thống Kê</Typography>
                      <Typography variant='body1'>
                        {`Từ ${formatDateToDMY(startDate)} đến ${formatDateToDMY(endDate)}`}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant='subtitle1' gutterBottom>
                    Doanh Thu Theo Phương Thức Thanh Toán
                  </Typography>
                  <LoadingWrapper isLoading={false} isEmpty={isPieChartEmpty} height={250}>
                    <PieChart
                      series={[{
                        data: processedData?.pieChartData || [],
                        innerRadius: 30,
                        outerRadius: 100,
                        paddingAngle: 2,
                        cornerRadius: 4
                      }]}
                      height={250}
                      slotProps={{
                        legend: {
                          direction: 'vertical',
                          position: { vertical: 'middle', horizontal: 'end' }
                        }
                      }}
                    />
                  </LoadingWrapper>
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
              <LoadingWrapper isLoading={false} isEmpty={isBarChartEmpty} height={350} emptyMessage="Không có dữ liệu trong khoảng thời gian này">
                <BarChart
                  xAxis={[{
                    scaleType: 'band',
                    data: processedData?.revenueByDate.map(item => item.date) || []
                  }]}
                  series={processedData?.barChartSeries || []}
                  height={350}
                />
              </LoadingWrapper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LoadingWrapper>
  )
}

export default memo(RevenueStatistics)
