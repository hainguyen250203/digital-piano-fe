import { useFetchGetStockStatistics } from '@/hooks/apis/statistics'
import { ReqStockStatistics, StockSortType } from '@/types/statistics.type'
import { formatCurrency } from '@/utils/format'

import FileDownloadIcon from '@mui/icons-material/FileDownload'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { PieChart } from '@mui/x-charts'
import { useState } from 'react'
import * as XLSX from 'xlsx'

const StockStatistics = () => {
  const [sortBy, setSortBy] = useState<StockSortType>(StockSortType.LOW_STOCK)
  const [params, setParams] = useState<ReqStockStatistics>({ sortBy: StockSortType.LOW_STOCK })

  const { data: stockData, isLoading } = useFetchGetStockStatistics(params)

  const handleSortChange = (event: SelectChangeEvent) => {
    const newSortBy = event.target.value as StockSortType
    setSortBy(newSortBy)
    setParams({ sortBy: newSortBy })
  }

  const exportToExcel = () => {
    if (!stockData?.data?.data) return

    // Prepare data for export
    const stockLevelsData = stockData.data.data.stockLevels.map(item => ({
      'Sản Phẩm': item.productName,
      'Danh Mục': item.categoryName,
      'Danh Mục Con': item.subCategoryName,
      'Số Lượng': item.quantity
    }))

    const recentChangesData = stockData.data.data.stockMovement.recentChanges.map(item => ({
      'Sản Phẩm': item.productName,
      'Loại Thay Đổi': item.changeType,
      'Số Lượng': item.change,
      'Thời Gian': new Date(item.createdAt).toLocaleDateString(),
      'Ghi Chú': item.note || '-'
    }))

    const importValueData =
      stockData.data.data.importValueData?.topProductsByImportValue?.map(product => ({
        'Sản Phẩm': product.productName,
        'Số Lượng': product.totalQuantity,
        'Giá Trị Nhập': product.totalImportValue,
        'Giá Trung Bình': product.averageImportPrice
      })) || []

    // Create workbook and worksheets
    const wb = XLSX.utils.book_new()

    const wsStockLevels = XLSX.utils.json_to_sheet(stockLevelsData)
    XLSX.utils.book_append_sheet(wb, wsStockLevels, 'Mức Tồn Kho')

    const wsRecentChanges = XLSX.utils.json_to_sheet(recentChangesData)
    XLSX.utils.book_append_sheet(wb, wsRecentChanges, 'Thay Đổi Gần Đây')

    const wsImportValues = XLSX.utils.json_to_sheet(importValueData)
    XLSX.utils.book_append_sheet(wb, wsImportValues, 'Giá Trị Nhập')

    // Save file
    XLSX.writeFile(wb, 'ThongKeTonKho.xlsx')
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
      <Box mb={3} display='flex' justifyContent='space-between' alignItems='center'>
        <FormControl size='small' sx={{ minWidth: 200 }}>
          <InputLabel>Sắp Xếp Theo</InputLabel>
          <Select value={sortBy} label='Sắp Xếp Theo' onChange={handleSortChange}>
            <MenuItem value={StockSortType.LOW_STOCK}>Hàng Tồn Thấp</MenuItem>
            <MenuItem value={StockSortType.HIGH_STOCK}>Hàng Tồn Cao</MenuItem>
            <MenuItem value={StockSortType.MOST_CHANGED}>Thay Đổi Nhiều Nhất</MenuItem>
          </Select>
        </FormControl>

        <Button variant='contained' color='success' startIcon={<FileDownloadIcon />} onClick={exportToExcel}>
          Xuất Excel
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stock Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title='Tổng Quan Tồn Kho' />
            <CardContent>
              <PieChart
                series={[
                  {
                    data: (() => {
                      const levels = stockData?.data?.data.stockLevels || []

                      const outOfStockCount = levels.filter(item => item.quantity === 0).length
                      const lowStockCount = levels.filter(item => item.quantity > 0 && item.quantity < 10).length
                      const normalCount = levels.length - outOfStockCount - lowStockCount

                      return [
                        { id: 0, value: outOfStockCount, label: 'Hết Hàng' },
                        { id: 1, value: lowStockCount, label: 'Sắp Hết' },
                        { id: 2, value: normalCount, label: 'Bình Thường' }
                      ]
                    })(),
                    innerRadius: 30,
                    outerRadius: 80,
                    paddingAngle: 2,
                    cornerRadius: 4
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

        {/* Stock Movement Summary */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader title='Biến Động Tồn Kho' />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box textAlign='center' p={1} bgcolor='success.light' borderRadius={1}>
                    <Typography variant='h6'>Nhập Hàng</Typography>
                    <Typography variant='h4'>{stockData?.data?.data.importValueData?.totalImportQuantity || 0}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box textAlign='center' p={1} bgcolor='info.light' borderRadius={1}>
                    <Typography variant='h6'>Bán Hàng</Typography>
                    <Typography variant='h4'>{stockData?.data?.data.importValueData?.totalSalesQuantity || 0}</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box textAlign='center' p={1} bgcolor='warning.light' borderRadius={1}>
                    <Typography variant='h6'>Trả Hàng</Typography>
                    <Typography variant='h4'>{stockData?.data?.data.importValueData?.totalReturnsQuantity || 0}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Import Value Data */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Giá Trị Nhập Hàng' />
            <CardContent>
              <Box mb={3}>
                <Typography variant='h5' fontWeight='bold' gutterBottom>
                  Tổng Giá Trị Nhập Hàng: {formatCurrency(stockData?.data?.data.importValueData?.totalImportValue || 0)}
                </Typography>
              </Box>

              <Grid container spacing={4}>
                {/* Recent Invoices */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant='h6' gutterBottom>
                    Hóa Đơn Nhập Gần Đây
                  </Typography>
                  <TableContainer sx={{ maxHeight: 300 }}>
                    <Table stickyHeader size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nhà Cung Cấp</TableCell>
                          <TableCell align='right'>Tổng Giá Trị</TableCell>
                          <TableCell>Ngày Nhập</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stockData?.data?.data.importValueData?.recentInvoices?.map((invoice, index) => (
                          <TableRow key={index}>
                            <TableCell>{invoice.supplierName}</TableCell>
                            <TableCell align='right'>{invoice.totalAmount.toLocaleString()} đ</TableCell>
                            <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        )) || (
                          <TableRow>
                            <TableCell colSpan={3} align='center'>
                              Không có dữ liệu
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Top Products by Import Value */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant='h6' gutterBottom>
                    Sản Phẩm Có Giá Trị Nhập Cao Nhất
                  </Typography>
                  <TableContainer sx={{ maxHeight: 300 }}>
                    <Table stickyHeader size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Sản Phẩm</TableCell>
                          <TableCell align='right'>Số Lượng</TableCell>
                          <TableCell align='right'>Giá Trị Nhập</TableCell>
                          <TableCell align='right'>Giá TB</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stockData?.data?.data.importValueData?.topProductsByImportValue?.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell align='right'>{product.totalQuantity}</TableCell>
                            <TableCell align='right'>{formatCurrency(product.totalImportValue)}</TableCell>
                            <TableCell align='right'>{formatCurrency(product.averageImportPrice)}</TableCell>
                          </TableRow>
                        )) || (
                          <TableRow>
                            <TableCell colSpan={4} align='center'>
                              Không có dữ liệu
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Levels */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Mức Tồn Kho' />
            <CardContent>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản Phẩm</TableCell>
                      <TableCell>Danh Mục</TableCell>
                      <TableCell>Danh Mục Con</TableCell>
                      <TableCell align='right'>Số Lượng</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockData?.data?.data.stockLevels.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.categoryName}</TableCell>
                        <TableCell>{item.subCategoryName}</TableCell>
                        <TableCell align='right'>{item.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Stock Changes */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Thay Đổi Tồn Kho Gần Đây' />
            <CardContent>
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản Phẩm</TableCell>
                      <TableCell>Loại Thay Đổi</TableCell>
                      <TableCell align='right'>Số Lượng</TableCell>
                      <TableCell>Thời Gian</TableCell>
                      <TableCell>Ghi Chú</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockData?.data?.data.stockMovement.recentChanges.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.changeType}</TableCell>
                        <TableCell align='right'>{item.change}</TableCell>
                        <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{item.note || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default StockStatistics
