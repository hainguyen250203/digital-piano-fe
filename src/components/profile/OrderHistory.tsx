'use client'

import OrderDetailPopup from '@/components/popup/OrderDetailPopup'
import { useOrderActions } from '@/hooks/order/useOrderActions'
import { BaseResponse } from '@/types/base-response'
import { ResponseOrder } from '@/types/order.type'
import { Alert, Box, Paper, TablePagination } from '@mui/material'
import OrderHistoryHeader from './OrderHistoryHeader'
import OrderStatusFilter from './OrderStatusFilter'
import OrdersTable from './OrdersTable'

interface OrderHistoryProps {
  orderData: BaseResponse<ResponseOrder[]> | undefined
  orderRefetch: () => void
}

export default function OrderHistory({ orderData, orderRefetch }: OrderHistoryProps) {
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

  if (!orderData) {
    return <Alert severity='error'>Không thể tải lịch sử đơn hàng. Vui lòng thử lại.</Alert>
  }

  const orders = orderData.data || []
  const { filteredOrders, paginatedOrders } = filterAndPaginateOrders(orders)

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
              Không tìm thấy đơn hàng nào{statusFilter !== 'all' ? ' với trạng thái đã chọn' : ''}.
            </Alert>
          </Box>
        ) : (
          <>
            <OrdersTable
              orders={paginatedOrders}
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
      </Paper>

      {/* Order detail popup */}
      {selectedOrderId && <OrderDetailPopup open={detailOpen} onClose={handleCloseDetail} orderId={selectedOrderId} />}
    </>
  )
}
