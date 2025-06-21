'use client'

import { ResProductReturn, ReturnStatus } from '@/types/return.interface'
import { formatDateTimeFromAny } from '@/utils/format'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, Card, CardContent, Chip, Divider, IconButton, Stack, Typography } from '@mui/material'

interface ReturnsGridProps {
  returns: ResProductReturn[]
  isCancelReturnLoading?: boolean
  onViewOrder?: (orderId: string) => void
  onCancelReturn?: (returnId: string) => void
}

function getReturnStatusLabel(status: ReturnStatus) {
  switch (status) {
    case ReturnStatus.PENDING:
      return 'Chờ duyệt'
    case ReturnStatus.APPROVED:
      return 'Đã duyệt'
    case ReturnStatus.REJECTED:
      return 'Từ chối'
    case ReturnStatus.COMPLETED:
      return 'Hoàn tất'
    default:
      return status
  }
}

function getReturnStatusColor(status: ReturnStatus) {
  switch (status) {
    case ReturnStatus.PENDING:
      return 'warning'
    case ReturnStatus.APPROVED:
      return 'info'
    case ReturnStatus.REJECTED:
      return 'error'
    case ReturnStatus.COMPLETED:
      return 'success'
    default:
      return 'default'
  }
}

export default function ReturnsGrid({ returns, onViewOrder }: ReturnsGridProps) {
  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        {returns.map(ret => (
          <Card
            key={ret.id}
            elevation={1}
            sx={{
              'borderRadius': 2,
              'transition': 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              {/* Return ID and Date */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant='subtitle2' fontWeight={600}>
                  Mã trả hàng: {ret.id}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {formatDateTimeFromAny(ret.createdAt)}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Return Status */}
              <Box sx={{ mb: 2 }}>
                <Chip label={getReturnStatusLabel(ret.status)} size='small' color={getReturnStatusColor(ret.status)} sx={{ mb: 1 }} />
              </Box>

              {/* Product Details */}
              <Box sx={{ mb: 2 }}>
                <Typography variant='caption' color='text.secondary'>
                  Sản phẩm
                </Typography>
                <Typography variant='body2' fontWeight={500}>
                  {ret.orderItem.product?.name}
                </Typography>
              </Box>

              {/* Return Details */}
              <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap' }}>
                <Box sx={{ width: '50%', mb: 1 }}>
                  <Typography variant='caption' color='text.secondary'>
                    Số lượng
                  </Typography>
                  <Typography variant='body2' fontWeight={500}>
                    {ret.quantity}
                  </Typography>
                </Box>
                <Box sx={{ width: '50%', mb: 1 }}>
                  <Typography variant='caption' color='text.secondary'>
                    Giá sản phẩm
                  </Typography>
                  <Typography variant='body2' fontWeight={500}>
                    {ret.orderItem.price.toLocaleString('vi-VN')}đ
                  </Typography>
                </Box>
              </Box>

              {/* Reason */}
              <Box sx={{ mb: 2 }}>
                <Typography variant='caption' color='text.secondary'>
                  Lý do trả hàng
                </Typography>
                <Typography variant='body2'>{ret.reason}</Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Order Info and Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Mã đơn hàng gốc
                  </Typography>
                  <Typography variant='body2' fontWeight={500}>
                    {ret.orderId}
                  </Typography>
                </Box>
                <IconButton
                  size='small'
                  onClick={() => onViewOrder?.(ret.orderId)}
                  title='Xem đơn hàng gốc'
                  sx={{
                    'color': 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'white'
                    }
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
