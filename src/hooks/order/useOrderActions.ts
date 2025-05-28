import { useFetchUserCancelOrder } from '@/hooks/apis/order'
import { BaseResponse } from '@/types/base-response'
import { ResponseOrder } from '@/types/order.type'
import { SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface UseOrderActionsProps {
  onOrderChanged: () => void
}

export function useOrderActions({ onOrderChanged }: UseOrderActionsProps) {
  // State
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // API hooks
  const { mutate: userCancelOrder, isPending: isUserCancelOrderLoading } = useFetchUserCancelOrder({
    onSuccess: (data: BaseResponse<ResponseOrder>) => {
      toast.success(data.message || 'Đơn hàng đã được hủy thành công', { position: 'top-center' })
      onOrderChanged()
    },
    onError: (error: BaseResponse<null>) => {
      toast.error(error.message || 'Đã có lỗi xảy ra trong quá trình hủy đơn hàng. Vui lòng thử lại sau.', { position: 'top-center' })
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

  const handleCancelOrder = (id: string) => {
    userCancelOrder(id)
  }

  const handleOrderStatusChange = () => {
    onOrderChanged()
  }

  // Format date helper
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter and paginate orders
  const filterAndPaginateOrders = (orders: ResponseOrder[]) => {
    const filteredOrders = statusFilter === 'all' 
      ? orders 
      : orders.filter(order => order.orderStatus === statusFilter)
    
    return {
      filteredOrders,
      paginatedOrders: filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }
  }

  return {
    // State
    statusFilter,
    page,
    rowsPerPage,
    selectedOrderId,
    detailOpen,
    isUserCancelOrderLoading,
    
    // Handlers
    handleStatusFilterChange,
    handleChangePage,
    handleChangeRowsPerPage,
    handleOpenDetail,
    handleCloseDetail,
    handleCancelOrder,
    handleOrderStatusChange,
    
    // Helpers
    formatDate,
    filterAndPaginateOrders
  }
} 