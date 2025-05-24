'use client'

import { OrderStatus, PaymentMethod, PaymentStatus, ResponseOrder } from '@/types/order.type'
import { getStatusColor, getStatusText } from '@/utils/order'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'

interface UpdateOrderStatusModalProps {
  open: boolean
  onClose: () => void
  order: ResponseOrder
  onUpdateStatus: (status: OrderStatus) => void
  isLoading: boolean
}

export default function UpdateOrderStatusModal({ open, onClose, order, onUpdateStatus, isLoading }: UpdateOrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.orderStatus)
  const [error, setError] = useState<string | null>(null)

  // Update selectedStatus when order prop changes
  useEffect(() => {
    setSelectedStatus(order.orderStatus)
  }, [order.orderStatus])

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value as OrderStatus)
    setError(null)
  }

  const handleSubmit = () => {
    // Validate that status has actually changed
    if (selectedStatus === order.orderStatus) {
      setError('Vui lòng chọn trạng thái khác với trạng thái hiện tại')
      return
    }

    // Validate VNPay unpaid orders
    if (order.paymentMethod === PaymentMethod.VNPAY && order.paymentStatus === PaymentStatus.UNPAID && selectedStatus !== OrderStatus.CANCELLED) {
      setError('Đơn hàng VNPay chưa thanh toán chỉ có thể bị hủy')
      return
    }

    // Validate logical status progression
    const currentStep = getOrderStatusStep(order.orderStatus)
    const newStep = getOrderStatusStep(selectedStatus)

    if (newStep !== -1 && newStep < currentStep) {
      setError('Không thể chuyển về trạng thái trước đó trong quy trình đơn hàng')
      return
    }

    // If valid, update status
    onUpdateStatus(selectedStatus)
  }

  // Helper function to get order step for validation
  const getOrderStatusStep = (status: OrderStatus): number => {
    switch (status) {
      case OrderStatus.PENDING:
        return 0
      case OrderStatus.PROCESSING:
        return 1
      case OrderStatus.SHIPPING:
        return 2
      case OrderStatus.DELIVERED:
        return 3
      case OrderStatus.CANCELLED:
      case OrderStatus.RETURNED:
        return -1 // Special cases
      default:
        return -1
    }
  }

  // Get available statuses based on current status
  const getAvailableStatuses = (): OrderStatus[] => {
    // If order is VNPay and unpaid, only allow cancellation
    if (order.paymentMethod === PaymentMethod.VNPAY && order.paymentStatus === PaymentStatus.UNPAID) {
      return [OrderStatus.CANCELLED]
    }

    switch (order.orderStatus) {
      case OrderStatus.PENDING:
        return [OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.CANCELLED]
      case OrderStatus.PROCESSING:
        return [OrderStatus.PROCESSING, OrderStatus.SHIPPING, OrderStatus.CANCELLED]
      case OrderStatus.SHIPPING:
        return [OrderStatus.SHIPPING, OrderStatus.DELIVERED, OrderStatus.RETURNED]
      case OrderStatus.DELIVERED:
        return [OrderStatus.DELIVERED, OrderStatus.RETURNED]
      case OrderStatus.CANCELLED:
      case OrderStatus.RETURNED:
        // Cannot change status after cancelled or returned
        return [order.orderStatus]
      default:
        return Object.values(OrderStatus)
    }
  }

  const availableStatuses = getAvailableStatuses()

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
        Cập Nhật Trạng Thái Đơn Hàng
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
          disabled={isLoading}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant='body1' gutterBottom>
            Mã đơn hàng: <strong>{order.id}</strong>
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Trạng thái hiện tại:
            <Box
              component='span'
              sx={{
                ml: 1,
                color: `${getStatusColor(order.orderStatus)}.main`,
                fontWeight: 'bold'
              }}
            >
              {getStatusText(order.orderStatus)}
            </Box>
          </Typography>
        </Box>

        <FormControl fullWidth error={!!error}>
          <InputLabel id='order-status-select-label'>Trạng thái mới</InputLabel>
          <Select
            labelId='order-status-select-label'
            id='order-status-select'
            value={selectedStatus}
            label='Trạng thái mới'
            onChange={handleChange}
            disabled={isLoading || availableStatuses.length <= 1}
          >
            {availableStatuses.map(status => (
              <MenuItem key={status} value={status} disabled={status === order.orderStatus}>
                {getStatusText(status)}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>

        <Box sx={{ mt: 3 }}>
          <Typography variant='caption' color='text.secondary'>
            Lưu ý: Việc thay đổi trạng thái đơn hàng có thể ảnh hưởng đến quá trình xử lý và trải nghiệm người dùng. Hãy đảm bảo rằng bạn đã xác nhận trạng thái đơn hàng hiện tại trước khi thay đổi.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Hủy
        </Button>
        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={isLoading || selectedStatus === order.orderStatus || availableStatuses.length <= 1}
          startIcon={isLoading && <CircularProgress size={20} color='inherit' />}
        >
          {isLoading ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
