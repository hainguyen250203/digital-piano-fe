import { useFetchRepayment, useFetchUserChangePaymentMethod, useFetchUserConfirmDelivery } from '@/hooks/apis/order'
import { BaseResponse } from '@/types/base-response'
import { OrderStatus, PaymentMethod, ResponseOrder, ResponseRepayment } from '@/types/order.type'
import { needsPayment } from '@/utils/order'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface OrderActionsProps {
  order: ResponseOrder
  isUserCancelOrderLoading: boolean
  onOpenDetail: (orderId: string) => void
  onCancelOrder: (orderId: string) => void
  onOrderStatusChange: () => void
}

export default function OrderActions({ order, isUserCancelOrderLoading, onOpenDetail, onCancelOrder, onOrderStatusChange }: OrderActionsProps) {
  const router = useRouter()
  const [paymentMethodAnchorEl, setPaymentMethodAnchorEl] = useState<null | HTMLElement>(null)

  const { mutate: repayment, isPending: isRepaymentLoading } = useFetchRepayment({
    onSuccess: (data: BaseResponse<ResponseRepayment>) => {
      router.push(data.data?.paymentUrl || '')
    },
    onError: error => {
      toast.error(error.message || 'Không thể thanh toán lại đơn hàng. Vui lòng thử lại sau.', { position: 'top-center' })
    }
  })

  const { mutate: confirmDelivery, isPending: isConfirmDeliveryLoading } = useFetchUserConfirmDelivery({
    onSuccess: (data: BaseResponse<ResponseOrder>) => {
      toast.success(data.message || 'Xác nhận đã nhận hàng thành công', { position: 'top-center' })
      onOrderStatusChange()
    },
    onError: (error: BaseResponse<null>) => {
      toast.error(error.message || 'Không thể xác nhận đã nhận hàng. Vui lòng thử lại sau.', { position: 'top-center' })
    }
  })

  const { mutate: updatePaymentMethod, isPending: isUpdatePaymentMethodLoading } = useFetchUserChangePaymentMethod({
    onSuccess: (data: BaseResponse<ResponseOrder>) => {
      toast.success(data.message || 'Cập nhật phương thức thanh toán thành công', { position: 'top-center' })
      onOrderStatusChange()
      setPaymentMethodAnchorEl(null)
    },
    onError: (error: BaseResponse<null>) => {
      toast.error(error.message || 'Không thể cập nhật phương thức thanh toán. Vui lòng thử lại sau.', { position: 'top-center' })
    }
  })

  const handleConfirmDelivery = () => {
    if (window.confirm('Bạn có chắc chắn đã nhận được hàng?')) {
      confirmDelivery(order.id)
    }
  }

  const handlePaymentMethodClick = (event: React.MouseEvent<HTMLElement>) => {
    setPaymentMethodAnchorEl(event.currentTarget)
  }

  const handlePaymentMethodClose = () => {
    setPaymentMethodAnchorEl(null)
  }

  const handlePaymentMethodChange = (newPaymentMethod: PaymentMethod) => {
    if (window.confirm('Bạn có chắc chắn muốn thay đổi phương thức thanh toán?')) {
      updatePaymentMethod({ id: order.id, paymentMethod: newPaymentMethod })
    }
  }

  return (
    <Box display='flex' gap={1}>
      <Tooltip title='Xem hóa đơn chi tiết'>
        <IconButton size='small' onClick={() => onOpenDetail(order.id)}>
          <ReceiptLongIcon fontSize='small' />
        </IconButton>
      </Tooltip>

      {order.orderStatus === OrderStatus.SHIPPING && (
        <Tooltip title='Xác nhận đã nhận hàng'>
          <IconButton size='small' color='success' onClick={handleConfirmDelivery} disabled={isConfirmDeliveryLoading}>
            <CheckCircleIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      )}

      {order.orderStatus === OrderStatus.PENDING && (
        <>
          <Tooltip title='Hủy đơn hàng này'>
            <IconButton size='small' color='error' onClick={() => onCancelOrder(order.id)} disabled={isUserCancelOrderLoading}>
              <DeleteOutlineIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title='Thay đổi phương thức thanh toán'>
            <IconButton size='small' color='primary' onClick={handlePaymentMethodClick} disabled={isUpdatePaymentMethodLoading}>
              <SwapHorizIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Menu anchorEl={paymentMethodAnchorEl} open={Boolean(paymentMethodAnchorEl)} onClose={handlePaymentMethodClose}>
            <MenuItem onClick={() => handlePaymentMethodChange(PaymentMethod.CASH)}>Thanh toán khi nhận hàng</MenuItem>
            <MenuItem onClick={() => handlePaymentMethodChange(PaymentMethod.VNPAY)}>VNPay</MenuItem>
          </Menu>
        </>
      )}

      {needsPayment(order) && order.orderStatus !== OrderStatus.CANCELLED && (
        <Tooltip title='Thanh toán'>
          <IconButton size='small' color='primary' onClick={() => repayment(order.id)} disabled={isRepaymentLoading}>
            <CreditCardIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}
