import { ResponseOrder } from '@/types/order.type'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import OrderRow from './OrderRow'

interface OrdersTableProps {
  orders: ResponseOrder[]
  isUserCancelOrderLoading: boolean
  onOpenDetail: (orderId: string) => void
  onCancelOrder: (orderId: string) => void
  onOrderStatusChange: () => void
}

export default function OrdersTable({
  orders,
  isUserCancelOrderLoading,
  onOpenDetail,
  onCancelOrder,
  onOrderStatusChange
}: OrdersTableProps) {
  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Mã đơn hàng
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Ngày đặt
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Trạng thái
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Thanh toán
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Phương thức
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Tổng tiền
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Thao tác
              </Typography>
            </TableCell>
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
              onOrderStatusChange={onOrderStatusChange}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
} 