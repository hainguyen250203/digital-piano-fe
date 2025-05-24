'use client'

import OrderDetailPopup from '@/components/popup/OrderDetailPopup'
import { useFetchUserCancelOrder } from '@/hooks/apis/order'
import { BaseResponse } from '@/types/base-response'
import { ResponseOrder } from '@/types/order.type'
import { Alert, Box, Paper, SelectChangeEvent, TablePagination } from '@mui/material'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import OrderHistoryHeader from './OrderHistoryHeader'
import OrderStatusFilter from './OrderStatusFilter'
import OrdersTable from './OrdersTable'

interface OrderHistoryProps {
  orderData: BaseResponse<ResponseOrder[]> | undefined
  orderRefetch: () => void
}

export default function OrderHistory({ orderData, orderRefetch }: OrderHistoryProps) {
  // State
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // API hooks
  const { mutate: userCancelOrder, isPending: isUserCancelOrderLoading } = useFetchUserCancelOrder({
    onSuccess: (data: BaseResponse<ResponseOrder>) => {
      toast.success(data.message || 'Đơn hàng đã được hủy thành công', { position: 'top-center' })
      orderRefetch()
    },
    onError: (error: BaseResponse<null>) => {
      toast.error(error.message || 'Đã có lỗi xảy ra trong quá trình hủy đơn hàng. Vui lòng thử lại sau.', { position: 'top-center' })
    }
  })

  // Event handlers
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value)
    setPage(0)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenDetail = (orderId: string) => {
    setSelectedOrderId(orderId)
    setDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setTimeout(() => {
      setSelectedOrderId(null)
    }, 300)
  }

  const handleCancelOrder = (id: string) => {
    userCancelOrder(id)
  }

  const handleOrderStatusChange = () => {
    orderRefetch()
  }

  // Format date helper
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!orderData) {
    return <Alert severity='error'>Không thể tải lịch sử đơn hàng. Vui lòng thử lại.</Alert>
  }

  const orders = orderData.data || []
  const filteredOrders = statusFilter === 'all' ? orders : orders.filter(order => order.orderStatus === statusFilter)
  const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
              formatDate={formatDate}
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
