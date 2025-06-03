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
          <MenuItem value={OrderStatus.PENDING}>
            <Typography variant='caption'>Chờ xác nhận</Typography>
          </MenuItem>
          <MenuItem value={OrderStatus.PROCESSING}>
            <Typography variant='caption'>Đang xử lý</Typography>
          </MenuItem>
          <MenuItem value={OrderStatus.SHIPPING}>
            <Typography variant='caption'>Đang giao hàng</Typography>
          </MenuItem>
          <MenuItem value={OrderStatus.DELIVERED}>
            <Typography variant='caption'>Đã giao hàng</Typography>
          </MenuItem>
          <MenuItem value={OrderStatus.CANCELLED}>
            <Typography variant='caption'>Đã hủy</Typography>
          </MenuItem>
          <MenuItem value={OrderStatus.RETURNED}>
            <Typography variant='caption'>Đã trả hàng</Typography>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
