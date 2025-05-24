import { ResponseOrder } from '@/types/order.type'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import OrderRow from './OrderRow'

interface OrdersTableProps {
  orders: ResponseOrder[]
  isUserCancelOrderLoading: boolean
  onOpenDetail: (orderId: string) => void
  onCancelOrder: (orderId: string) => void
  formatDate: (dateString: Date) => string
  onOrderStatusChange: () => void
}

export default function OrdersTable({
  orders,
  isUserCancelOrderLoading,
  onOpenDetail,
  onCancelOrder,
  formatDate,
  onOrderStatusChange
}: OrdersTableProps) {
  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Mã đơn hàng</TableCell>
            <TableCell>Ngày đặt</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Thanh toán</TableCell>
            <TableCell>Phương thức</TableCell>
            <TableCell>Tổng tiền</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(order => (
            <OrderRow
              key={order.id}
              order={order}
              isUserCancelOrderLoading={isUserCancelOrderLoading}
              onOpenDetail={onOpenDetail}
              onCancelOrder={onCancelOrder}
              formatDate={formatDate}
              onOrderStatusChange={onOrderStatusChange}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
} 