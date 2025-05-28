import { useFetchGetProductStatistics } from '@/hooks/apis/statistics'
import { ReqProductStatistics } from '@/types/statistics.type'
import { formatCurrency } from '@/utils/format'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { useState } from 'react'
import * as XLSX from 'xlsx'

const ProductStatistics = () => {
  const [params] = useState<ReqProductStatistics>({})
  const { data: productData, isLoading } = useFetchGetProductStatistics(params)

  const exportToExcel = () => {
    if (!productData?.data) return

    // Prepare data for export
    const bestSellingData = productData.data.bestSellingProducts.map(item => ({
      'Sản Phẩm': item.product.name,
      'Số Lượng': item.totalQuantity,
      'Doanh Thu': item.totalRevenue
    }))

    const highestRevenueData = productData.data.highestRevenueProducts.map(item => ({
      'Sản Phẩm': item.product.name,
      'Số Lượng': item.totalQuantity,
      'Doanh Thu': item.totalRevenue
    }))

    const categoryData = productData.data.salesByCategory.map(item => ({
      'Danh Mục': item.categoryName,
      'Số Lượng': item.totalQuantity,
      'Doanh Thu': item.totalRevenue
    }))

    const subCategoryData = productData.data.salesBySubCategory.map(item => ({
      'Danh Mục': item.categoryName,
      'Danh Mục Con': item.subCategoryName,
      'Số Lượng': item.totalQuantity,
      'Doanh Thu': item.totalRevenue
    }))

    // Create workbook and worksheets
    const wb = XLSX.utils.book_new()

    const wsBestSelling = XLSX.utils.json_to_sheet(bestSellingData)
    XLSX.utils.book_append_sheet(wb, wsBestSelling, 'Sản Phẩm Bán Chạy')

    const wsHighestRevenue = XLSX.utils.json_to_sheet(highestRevenueData)
    XLSX.utils.book_append_sheet(wb, wsHighestRevenue, 'Doanh Thu Cao Nhất')

    const wsCategory = XLSX.utils.json_to_sheet(categoryData)
    XLSX.utils.book_append_sheet(wb, wsCategory, 'Theo Danh Mục')

    const wsSubCategory = XLSX.utils.json_to_sheet(subCategoryData)
    XLSX.utils.book_append_sheet(wb, wsSubCategory, 'Theo Danh Mục Con')

    // Save file
    XLSX.writeFile(wb, 'ThongKeSanPham.xlsx')
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
        <Box />
        <Button variant='contained' color='success' startIcon={<FileDownloadIcon />} onClick={exportToExcel}>
          Xuất Excel
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Best Selling Products */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title='Sản Phẩm Bán Chạy Nhất' />
            <CardContent>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản Phẩm</TableCell>
                      <TableCell align='right'>Số Lượng</TableCell>
                      <TableCell align='right'>Doanh Thu</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productData?.data?.bestSellingProducts.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell align='right'>{item.totalQuantity}</TableCell>
                        <TableCell align='right'>{formatCurrency(item.totalRevenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Highest Revenue Products */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title='Sản Phẩm Doanh Thu Cao Nhất' />
            <CardContent>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản Phẩm</TableCell>
                      <TableCell align='right'>Số Lượng</TableCell>
                      <TableCell align='right'>Doanh Thu</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productData?.data?.highestRevenueProducts.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell align='right'>{item.totalQuantity}</TableCell>
                        <TableCell align='right'>{formatCurrency(item.totalRevenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales by Category */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Doanh Thu Theo Danh Mục' />
            <CardContent sx={{ height: 400 }}>
              {productData?.data?.salesByCategory && (
                <BarChart
                  xAxis={[
                    {
                      scaleType: 'band',
                      data: productData.data.salesByCategory.map(item => item.categoryName)
                    }
                  ]}
                  series={[
                    {
                      data: productData.data.salesByCategory.map(item => item.totalRevenue),
                      label: 'Doanh Thu',
                      color: '#2196f3'
                    }
                  ]}
                  height={350}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sales by SubCategory */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Doanh Thu Theo Danh Mục Con' />
            <CardContent>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Danh Mục</TableCell>
                      <TableCell>Danh Mục Con</TableCell>
                      <TableCell align='right'>Số Lượng</TableCell>
                      <TableCell align='right'>Doanh Thu</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productData?.data?.salesBySubCategory.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.categoryName}</TableCell>
                        <TableCell>{item.subCategoryName}</TableCell>
                        <TableCell align='right'>{item.totalQuantity}</TableCell>
                        <TableCell align='right'>{formatCurrency(item.totalRevenue)}</TableCell>
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

export default ProductStatistics
