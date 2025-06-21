import { useFetchCancelProductReturn } from '@/hooks/apis/product-return'
import { ResProductReturn } from '@/types/return.interface'
import { SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface UseReturnActionsProps {
  onReturnChanged?: () => void
}

export function useReturnActions({ onReturnChanged }: UseReturnActionsProps = {}) {
  // State
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // API hooks
  const { mutate: cancelReturn, isPending: isCancelReturnLoading } = useFetchCancelProductReturn({
    onSuccess: (data) => {
      toast.success(data.message || 'Đã hủy yêu cầu trả hàng thành công', { position: 'top-center' })
      onReturnChanged?.()
    },
    onError: (error) => {
      toast.error(error.message || 'Đã có lỗi xảy ra trong quá trình hủy yêu cầu trả hàng. Vui lòng thử lại sau.', { position: 'top-center' })
    }
  })

  // Event handlers
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value)
    setPage(0)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenDetail = (orderId: string) => {
    setSelectedOrderId(orderId)
    setDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setDetailOpen(false)
    setTimeout(() => {
      setSelectedOrderId(null)
    }, 300)
  }

  const handleCancelReturn = (returnId: string) => {
    cancelReturn(returnId)
  }

  const handleReturnChanged = () => {
    onReturnChanged?.()
  }

  // Filter and paginate returns
  const filterAndPaginateReturns = (returns: ResProductReturn[]) => {
    const filteredReturns = statusFilter === 'all'
      ? returns
      : returns.filter(ret => ret.status === statusFilter)

    return {
      filteredReturns,
      paginatedReturns: filteredReturns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }
  }

  return {
    // State
    statusFilter,
    page,
    rowsPerPage,
    selectedOrderId,
    detailOpen,
    isCancelReturnLoading,

    // Handlers
    handleStatusFilterChange,
    handleChangePage,
    handleChangeRowsPerPage,
    handleOpenDetail,
    handleCloseDetail,
    handleCancelReturn,
    handleReturnChanged,

    // Helpers
    filterAndPaginateReturns
  }
} 