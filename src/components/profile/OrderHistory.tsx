'use client'

import OrderDetailPopup from '@/components/popup/OrderDetailPopup/OrderDetailPopup'
import { useOrderActions } from '@/hooks/order/useOrderActions'
import { BaseResponse } from '@/types/base-response'
import { ResponseOrder } from '@/types/order.type'
import { Alert, Box, Paper, TablePagination, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useMemo } from 'react'
import OrderHistoryHeader from './OrderHistoryHeader'
import OrderStatusFilter from './OrderStatusFilter'
import OrdersGrid from './OrdersGrid'
import OrdersTable from './OrdersTable'

interface OrderHistoryProps {
  orderData: BaseResponse<ResponseOrder[]> | undefined
  orderRefetch: () => void
}

export default function OrderHistory({ orderData, orderRefetch }: OrderHistoryProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Use order actions hook
  const {
    statusFilter,
    page,
    rowsPerPage,
    selectedOrderId,
    detailOpen,
    isUserCancelOrderLoading,
    handleStatusFilterChange,
    handleChangePage,
    handleChangeRowsPerPage,
    handleOpenDetail,
    handleCloseDetail,
    handleCancelOrder,
    handleOrderStatusChange,
    filterAndPaginateOrders
  } = useOrderActions({
    onOrderChanged: orderRefetch
  })

  const orders = orderData?.data || []
  const { filteredOrders } = filterAndPaginateOrders(orders)

  // Get paginated orders for desktop/tablet, all orders for mobile
  const displayOrders = useMemo(() => {
    if (isMobile) return filteredOrders
    return filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [filteredOrders, isMobile, page, rowsPerPage])

  if (!orderData) {
    return (
      <Alert severity='error'>
        <Typography variant='body1'>Không thể tải lịch sử đơn hàng. Vui lòng thử lại.</Typography>
      </Alert>
    )
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <OrderHistoryHeader />
        <OrderStatusFilter statusFilter={statusFilter} onStatusFilterChange={handleStatusFilterChange} />

        {filteredOrders.length === 0 ? (
          <Box p={3}>
            <Alert severity='info' sx={{ borderRadius: 2 }}>
              <Typography variant='body1'>Không tìm thấy đơn hàng nào{statusFilter !== 'all' ? ' với trạng thái đã chọn' : ''}.</Typography>
            </Alert>
          </Box>
        ) : (
          <>
            {isMobile ? (
              <OrdersGrid
                orders={displayOrders}
                isUserCancelOrderLoading={isUserCancelOrderLoading}
                onOpenDetail={handleOpenDetail}
                onCancelOrder={handleCancelOrder}
                onOrderStatusChange={handleOrderStatusChange}
              />
            ) : (
              <>
                <OrdersTable
                  orders={displayOrders}
                  isUserCancelOrderLoading={isUserCancelOrderLoading}
                  onOpenDetail={handleOpenDetail}
                  onCancelOrder={handleCancelOrder}
                  onOrderStatusChange={handleOrderStatusChange}
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component='div'
                  count={filteredOrders.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage='Đơn hàng mỗi trang:'
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
                />
              </>
            )}
          </>
        )}
      </Paper>

      {/* Order detail popup */}
      {selectedOrderId && <OrderDetailPopup open={detailOpen} onClose={handleCloseDetail} orderId={selectedOrderId} />}
    </>
  )
}
