import { useFetchUpdateProductReturnStatus } from '@/hooks/apis/product-return'
import { ResProductReturn, ReturnStatus } from '@/types/return.interface'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Chip, FormControl, IconButton, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

interface ReturnTableProps {
  returns: ResProductReturn[]
  isAdmin?: boolean
  onViewOrder?: (orderId: string, orderItemId: string) => void
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

const statusOptions = [
  { value: ReturnStatus.PENDING, label: 'Chờ duyệt' },
  { value: ReturnStatus.APPROVED, label: 'Đã duyệt' },
  { value: ReturnStatus.REJECTED, label: 'Từ chối' },
  { value: ReturnStatus.COMPLETED, label: 'Hoàn tất' }
]

export default function ReturnTable({ returns, isAdmin, onViewOrder }: ReturnTableProps) {
  const [localReturns, setLocalReturns] = useState(returns)
  const [lastUpdate, setLastUpdate] = useState<{ returnId: string; status: ReturnStatus } | null>(null)

  // Sync localReturns if returns prop changes
  React.useEffect(() => {
    setLocalReturns(returns)
  }, [returns])

  const { mutate: updateStatus, isPending } = useFetchUpdateProductReturnStatus({
    onError: (error: unknown) => {
      const err = error as { message?: string }
      toast.error(err.message || 'cập nhật trạng thái không thành công', { position: 'top-center' })
    },
    onSuccess: () => {
      if (lastUpdate) {
        setLocalReturns(prev => prev.map(r => (r.id === lastUpdate.returnId ? { ...r, status: lastUpdate.status } : r)))
        setLastUpdate(null)
      }
    }
  })

  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant='subtitle2' fontWeight={600}>
                Mã trả hàng
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle2' fontWeight={600}>
                Ngày yêu cầu
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle2' fontWeight={600}>
                Sản phẩm
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle2' fontWeight={600}>
                Số lượng
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle2' fontWeight={600}>
                Lý do
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='subtitle2' fontWeight={600}>
                Trạng thái
              </Typography>
            </TableCell>
            {isAdmin && (
              <TableCell>
                <Typography variant='subtitle2' fontWeight={600}>
                  Thao tác
                </Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {localReturns.map(ret => (
            <TableRow key={ret.id} hover>
              <TableCell>
                <Typography variant='body2' fontWeight={500}>
                  {ret.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body2'>{new Date(ret.createdAt).toLocaleString()}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body2'>{ret.orderItem.product?.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body2'>{ret.quantity}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body2'>{ret.reason}</Typography>
              </TableCell>
              <TableCell>
                {isAdmin ? (
                  <FormControl size='small' fullWidth>
                    <Select
                      value={ret.status}
                      onChange={e => {
                        setLastUpdate({ returnId: ret.id, status: e.target.value as ReturnStatus })
                        updateStatus({ returnId: ret.id, payload: { status: e.target.value as ReturnStatus } })
                      }}
                      disabled={isPending || ret.status === ReturnStatus.COMPLETED || ret.status === ReturnStatus.REJECTED}
                    >
                      {statusOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Chip
                    label={getReturnStatusLabel(ret.status)}
                    size='small'
                    color={ret.status === ReturnStatus.PENDING ? 'warning' : ret.status === ReturnStatus.APPROVED ? 'info' : ret.status === ReturnStatus.REJECTED ? 'error' : 'success'}
                  />
                )}
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <IconButton size='small' onClick={() => onViewOrder?.(ret.orderId, ret.orderItem.id)} title='Xem đơn hàng'>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
