import { OrderStatus } from '@/types/order.type'
import { Box, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'

interface OrderStatusFilterProps {
  statusFilter: string
  onStatusFilterChange: (event: SelectChangeEvent) => void
}

export default function OrderStatusFilter({ statusFilter, onStatusFilterChange }: OrderStatusFilterProps) {
  return (
    <Box p={2} display='flex' gap={2} flexWrap='wrap'>
      <FormControl size='small' style={{ minWidth: 200 }}>
        <Typography variant='caption' gutterBottom>
          Trạng thái đơn hàng
        </Typography>
        <Select value={statusFilter} onChange={onStatusFilterChange}>
          <MenuItem value='all'>Tất cả đơn hàng</MenuItem>
          <MenuItem value={OrderStatus.PENDING}>Chờ xác nhận</MenuItem>
          <MenuItem value={OrderStatus.PROCESSING}>Đang xử lý</MenuItem>
          <MenuItem value={OrderStatus.SHIPPING}>Đang giao hàng</MenuItem>
          <MenuItem value={OrderStatus.DELIVERED}>Đã giao hàng</MenuItem>
          <MenuItem value={OrderStatus.CANCELLED}>Đã hủy</MenuItem>
          <MenuItem value={OrderStatus.RETURNED}>Đã trả hàng</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
} 