import { ResponseOrder } from '@/types/order.type'
import { formatDateTimeFromAny } from '@/utils/format'
import { formatNumber, formatPaymentMethod, getPaymentStatusColor, getPaymentStatusText, getStatusColor, getStatusIcon, getStatusText } from '@/utils/order'
import { Chip, TableCell, TableRow, Typography } from '@mui/material'
import OrderActions from './OrderActions'

interface OrderRowProps {
  order: ResponseOrder
  isUserCancelOrderLoading: boolean
  onOpenDetail: (orderId: string) => void
  onCancelOrder: (orderId: string) => void
  onOrderStatusChange: () => void
}

export default function OrderRow({ order, isUserCancelOrderLoading, onOpenDetail, onCancelOrder, onOrderStatusChange }: OrderRowProps) {
  return (
    <TableRow hover>
      <TableCell>
        <Typography variant='body2' fontWeight={500}>
          {order.id}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant='body2'>
          {formatDateTimeFromAny(order.createdAt)}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip icon={getStatusIcon(order.orderStatus)} label={getStatusText(order.orderStatus)} size='small' color={getStatusColor(order.orderStatus)} />
      </TableCell>
      <TableCell>
        <Chip label={getPaymentStatusText(order.paymentStatus)} size='small' color={getPaymentStatusColor(order.paymentStatus)} />
      </TableCell>
      <TableCell>
        <Typography variant='body2'>
          {formatPaymentMethod(order.paymentMethod)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant='subtitle2' fontWeight={600} color="primary.main">
          {formatNumber(order.orderTotal)} VNĐ
        </Typography>
      </TableCell>
      <TableCell>
        <OrderActions order={order} isUserCancelOrderLoading={isUserCancelOrderLoading} onOpenDetail={onOpenDetail} onCancelOrder={onCancelOrder} onOrderStatusChange={onOrderStatusChange} />
      </TableCell>
    </TableRow>
  )
}
