import { OrderStatus } from '@/types/order.type'
import { ReturnStatus } from '@/types/return.interface'
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
        </Select>
      </FormControl>
    </Box>
  )
}

export function ReturnStatusFilter({ statusFilter, onStatusFilterChange }: OrderStatusFilterProps) {
  return (
    <Box p={2} display='flex' gap={2} flexWrap='wrap'>
      <FormControl size='small' style={{ minWidth: 200 }}>
        <Typography variant='caption' gutterBottom>
          Trạng thái trả hàng
        </Typography>
        <Select value={statusFilter} onChange={onStatusFilterChange}>
          <MenuItem value='all'>Tất cả trả hàng</MenuItem>
          <MenuItem value={ReturnStatus.PENDING}>
            <Typography variant='caption'>Chờ duyệt</Typography>
          </MenuItem>
          <MenuItem value={ReturnStatus.APPROVED}>
            <Typography variant='caption'>Đã duyệt</Typography>
          </MenuItem>
          <MenuItem value={ReturnStatus.REJECTED}>
            <Typography variant='caption'>Từ chối</Typography>
          </MenuItem>
          <MenuItem value={ReturnStatus.COMPLETED}>
            <Typography variant='caption'>Hoàn tất</Typography>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
