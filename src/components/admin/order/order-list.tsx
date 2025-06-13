'use client'

import DeleteConfirmationDialog from '@/components/admin/common/delete-confirmation-dialog'
import ViewOrderModal from '@/components/admin/order/view-order-modal'
import { useFetchAdminCancelOrder, useFetchGetOrderDetail, useFetchUpdateOrderStatus } from '@/hooks/apis/order'
import { QueryKey } from '@/models/QueryKey'
import { OrderStatus, PaymentMethod, PaymentStatus, ResponseOrder } from '@/types/order.type'
import { formatCurrency, formatDateTimeFromAny } from '@/utils/format'
import { formatPaymentMethod, getPaymentStatusColor, getPaymentStatusText, getStatusColor, getStatusIcon, getStatusText } from '@/utils/order'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import UpdateOrderStatusModal from './update-order-status-modal'

export default function OrderList({ orders }: { orders: ResponseOrder[] }) {
  // STATE DECLARATIONS
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewOrderModalOpen, setViewOrderModalOpen] = useState(false)
  const [updateStatusModalOpen, setUpdateStatusModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all')

  // HOOKS
  const queryClient = useQueryClient()
  const { data: selectedOrderData } = useFetchGetOrderDetail(selectedOrderId || '')

  const { mutate: updateOrderStatus, isPending: isUpdateStatusPending } = useFetchUpdateOrderStatus({
    onSuccess: () => {
      toast.success('Cập nhật trạng thái đơn hàng thành công!')
      handleCloseUpdateStatusModal()
      queryClient.invalidateQueries({ queryKey: [QueryKey.ORDER_LIST] })
      if (selectedOrderId) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.ORDER_DETAIL, selectedOrderId] })
      }
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  const { mutate: cancelOrder, isPending: isCancelOrderPending } = useFetchAdminCancelOrder({
    onSuccess: () => {
      toast.success('Hủy đơn hàng thành công!')
      handleCloseDeleteDialog()
      queryClient.invalidateQueries({ queryKey: [QueryKey.ORDER_LIST] })
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  // Filter orders based on search query and filters
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return []

    let result = orders

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.orderStatus === statusFilter)
    }

    // Apply payment status filter
    if (paymentStatusFilter !== 'all') {
      result = result.filter(order => order.paymentStatus === paymentStatusFilter)
    }

    // Apply payment method filter
    if (paymentMethodFilter !== 'all') {
      result = result.filter(order => order.paymentMethod === paymentMethodFilter)
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        order => order.id.toLowerCase().includes(query) || (order.address?.fullName || '').toLowerCase().includes(query) || (order.address?.phone || '').toLowerCase().includes(query)
      )
    }

    return result
  }, [orders, searchQuery, statusFilter, paymentStatusFilter, paymentMethodFilter])

  // EVENT HANDLERS
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPage(0)
  }

  const handleUpdateStatus = (orderId: string) => {
    setSelectedOrderId(orderId)
    setUpdateStatusModalOpen(true)
  }

  const handleCloseUpdateStatusModal = () => {
    setUpdateStatusModalOpen(false)
    setSelectedOrderId(null)
  }

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value)
    setPage(0)
  }

  const handlePaymentStatusFilterChange = (event: SelectChangeEvent) => {
    setPaymentStatusFilter(event.target.value)
    setPage(0)
  }

  const handlePaymentMethodFilterChange = (event: SelectChangeEvent) => {
    setPaymentMethodFilter(event.target.value)
    setPage(0)
  }

  const handleConfirmUpdateStatus = (status: OrderStatus) => {
    if (!selectedOrderId) return
    updateOrderStatus({ id: selectedOrderId, status })
  }

  const handleCancel = (orderId: string) => {
    setSelectedOrderId(orderId)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedOrderId(null)
  }

  const handleConfirmCancel = () => {
    if (!selectedOrderId) return
    cancelOrder(selectedOrderId)
  }

  const handleView = (orderId: string) => {
    setSelectedOrderId(orderId)
    setViewOrderModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setViewOrderModalOpen(false)
    setSelectedOrderId(null)
  }

  // Helper to check if order can be cancelled
  const canCancelOrder = (order: ResponseOrder) => {
    return order.orderStatus === OrderStatus.PENDING || order.orderStatus === OrderStatus.PROCESSING
  }

  return (
    <>
      <Box mb={2} display='flex' justifyContent='space-between' gap={2} alignItems='center' flexWrap='wrap'>
        <Typography variant='h5'>Quản lý đơn hàng</Typography>
        <Box display='flex' gap={2} alignItems='center' flexWrap='wrap'>
          <TextField
            placeholder='Tìm kiếm đơn hàng'
            variant='outlined'
            size='small'
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            style={{ minWidth: 250 }}
          />
        </Box>
      </Box>

      {/* Filters */}
      <Box mb={2} display='flex' gap={2} flexWrap='wrap'>
        <FormControl size='small' style={{ minWidth: 150 }}>
          <Typography variant='caption' gutterBottom>
            Trạng thái đơn hàng
          </Typography>
          <Select value={statusFilter} onChange={handleStatusFilterChange}>
            <MenuItem value='all'>Tất cả</MenuItem>
            <MenuItem value={OrderStatus.PENDING}>Chờ xác nhận</MenuItem>
            <MenuItem value={OrderStatus.PROCESSING}>Đang xử lý</MenuItem>
            <MenuItem value={OrderStatus.SHIPPING}>Đang giao hàng</MenuItem>
            <MenuItem value={OrderStatus.DELIVERED}>Đã giao hàng</MenuItem>
            <MenuItem value={OrderStatus.CANCELLED}>Đã hủy</MenuItem>
            <MenuItem value={OrderStatus.RETURNED}>Đã trả hàng</MenuItem>
          </Select>
        </FormControl>

        <FormControl size='small' style={{ minWidth: 150 }}>
          <Typography variant='caption' gutterBottom>
            Trạng thái thanh toán
          </Typography>
          <Select value={paymentStatusFilter} onChange={handlePaymentStatusFilterChange}>
            <MenuItem value='all'>Tất cả</MenuItem>
            <MenuItem value={PaymentStatus.PAID}>Đã thanh toán</MenuItem>
            <MenuItem value={PaymentStatus.UNPAID}>Chưa thanh toán</MenuItem>
            <MenuItem value={PaymentStatus.FAILED}>Thanh toán thất bại</MenuItem>
            <MenuItem value={PaymentStatus.REFUNDED}>Đã hoàn tiền</MenuItem>
          </Select>
        </FormControl>

        <FormControl size='small' style={{ minWidth: 150 }}>
          <Typography variant='caption' gutterBottom>
            Phương thức thanh toán
          </Typography>
          <Select value={paymentMethodFilter} onChange={handlePaymentMethodFilterChange}>
            <MenuItem value='all'>Tất cả</MenuItem>
            <MenuItem value={PaymentMethod.CASH}>Tiền mặt</MenuItem>
            <MenuItem value={PaymentMethod.VNPAY}>VNPay</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper style={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer style={{ maxHeight: '100%' }}>
          <Table stickyHeader aria-label='simple table' style={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Ngày đặt</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thanh toán</TableCell>
                <TableCell>Phương thức</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    {searchQuery || statusFilter !== 'all' || paymentStatusFilter !== 'all' || paymentMethodFilter !== 'all' ? 'Không tìm thấy đơn hàng phù hợp' : 'Không có đơn hàng nào'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(order => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{formatDateTimeFromAny(order.createdAt)}</TableCell>
                    <TableCell>
                      {order.address ? (
                        <Box>
                          <Typography variant='body2'>{order.address.fullName}</Typography>
                          <Typography variant='caption'>{order.address.phone}</Typography>
                        </Box>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip icon={getStatusIcon(order.orderStatus)} label={getStatusText(order.orderStatus)} size='small' color={getStatusColor(order.orderStatus)} />
                    </TableCell>
                    <TableCell>
                      <Chip label={getPaymentStatusText(order.paymentStatus)} size='small' color={getPaymentStatusColor(order.paymentStatus)} />
                    </TableCell>
                    <TableCell>{formatPaymentMethod(order.paymentMethod)}</TableCell>
                    <TableCell>{formatCurrency(order.orderTotal)}</TableCell>
                    <TableCell>
                      <Box display='flex' gap={1}>
                        <Tooltip title='Xem chi tiết'>
                          <IconButton size='small' onClick={() => handleView(order.id)}>
                            <VisibilityIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Cập nhật trạng thái'>
                          <IconButton size='small' onClick={() => handleUpdateStatus(order.id)} disabled={order.orderStatus === OrderStatus.CANCELLED || order.orderStatus === OrderStatus.DELIVERED}>
                            <EditIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        {canCancelOrder(order) && (
                          <Tooltip title='Hủy đơn hàng'>
                            <IconButton size='small' onClick={() => handleCancel(order.id)} color='error'>
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='Dòng trên trang:'
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* View Order Modal */}
      {selectedOrderId && <ViewOrderModal open={viewOrderModalOpen} onClose={handleCloseViewModal} orderId={selectedOrderId} />}

      {/* Update Status Modal */}
      {selectedOrderId && selectedOrderData && selectedOrderData.data && (
        <UpdateOrderStatusModal
          open={updateStatusModalOpen}
          onClose={handleCloseUpdateStatusModal}
          order={selectedOrderData.data}
          onUpdateStatus={handleConfirmUpdateStatus}
          isLoading={isUpdateStatusPending}
        />
      )}

      {/* Cancel Order Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmCancel}
        title='Hủy đơn hàng'
        message='Bạn có chắc chắn muốn hủy đơn hàng này không? Thao tác này không thể hoàn tác.'
        isDeleting={isCancelOrderPending}
        confirmButtonText='Hủy đơn hàng'
      />
    </>
  )
}
