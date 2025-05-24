'use client'

import { DiscountData, DiscountType, useFetchDeleteDiscount, useFetchDiscountList, useFetchUpdateDiscount } from '@/hooks/apis/discount'
import { QueryKey } from '@/models/QueryKey'
import { formatCurrency } from '@/utils/format'
import AddIcon from '@mui/icons-material/Add'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import RestoreIcon from '@mui/icons-material/Restore'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import DeleteConfirmationDialog from '../common/delete-confirmation-dialog'
import CreateDiscountModal from './create-discount-modal'
import EditDiscountModal from './edit-discount-modal'

export default function DiscountList() {
  // States for modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountData | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Search state
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  // Fetch discount data
  const { data: discountResponse, isLoading } = useFetchDiscountList()

  // Update discount mutation
  const { mutate: updateDiscount, isPending: isUpdatePending } = useFetchUpdateDiscount({
    onSuccess: () => {
      toast.success('Cập nhật mã giảm giá thành công!')
      handleCloseEditModal()
      handleCloseRestoreDialog()
    },
    onError: error => {
      toast.error(error.message || 'Không thể cập nhật mã giảm giá')
    }
  })

  // Delete discount mutation
  const { mutate: deleteDiscount, isPending: isDeletePending } = useFetchDeleteDiscount({
    onSuccess: () => {
      toast.success('Xóa mã giảm giá thành công!')
      queryClient.invalidateQueries({ queryKey: [QueryKey.DISCOUNT_LIST] })
      handleCloseDeleteDialog()
    },
    onError: error => {
      toast.error(error.message || 'Không thể xóa mã giảm giá')
    }
  })

  // Filter discounts based on search term
  const filteredDiscounts = useMemo(() => {
    const discounts = discountResponse?.data || []
    if (!searchTerm.trim()) return discounts

    const query = searchTerm.toLowerCase()
    return discounts.filter(
      (discount: DiscountData) =>
        discount.code.toLowerCase().includes(query) || (discount.description && discount.description.toLowerCase().includes(query)) || discount.id.toLowerCase().includes(query)
    )
  }, [discountResponse?.data, searchTerm])

  // Handler for pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handler for search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  // Handler for copying discount code
  const handleCopyCode = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success(`Đã sao chép mã: ${code}`)
      })
      .catch(() => {
        toast.error('Không thể sao chép mã')
      })
  }

  // Handlers for modals
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false)
  }

  const handleEdit = (discount: DiscountData) => {
    if (discount.isDeleted) return
    setSelectedDiscount(discount)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedDiscount(null)
  }

  // Handler for delete action
  const handleDelete = (discount: DiscountData) => {
    if (discount.isDeleted) return
    setSelectedDiscount(discount)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedDiscount(null)
  }

  const handleConfirmDelete = () => {
    if (!selectedDiscount) return
    deleteDiscount(selectedDiscount.id)
  }

  // Handlers for restore
  const handleRestore = (discount: DiscountData) => {
    if (!discount.isDeleted) return
    setSelectedDiscount(discount)
    setIsRestoreDialogOpen(true)
  }

  const handleCloseRestoreDialog = () => {
    setIsRestoreDialogOpen(false)
    setSelectedDiscount(null)
  }

  const handleConfirmRestore = () => {
    if (!selectedDiscount) return

    updateDiscount({
      id: selectedDiscount.id,
      data: {
        isDeleted: false
      }
    })
  }

  // Format date for display
  const formatDate = (dateString?: Date | string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h5'>Quản lý mã giảm giá</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size='small'
            placeholder='Tìm kiếm mã giảm giá...'
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 250 }}
          />

          <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
            Tạo mã giảm giá
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='discount table'>
            <TableHead>
              <TableRow>
                <TableCell>Mã</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Giá trị</TableCell>
                <TableCell>Hiệu lực</TableCell>
                <TableCell>Sử dụng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDiscounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(discount => (
                <TableRow
                  key={discount.id}
                  sx={{
                    'backgroundColor': discount.isDeleted ? 'rgba(244, 67, 54, 0.08)' : 'inherit',
                    '&:hover': {
                      backgroundColor: discount.isDeleted ? 'rgba(244, 67, 54, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant='body2'
                        component='span'
                        fontWeight='medium'
                        sx={{
                          textDecoration: discount.isDeleted ? 'line-through' : 'none',
                          color: discount.isDeleted ? 'text.disabled' : 'text.primary'
                        }}
                      >
                        {discount.code}
                      </Typography>
                      {!discount.isDeleted && (
                        <Tooltip title='Sao chép mã'>
                          <IconButton size='small' onClick={() => handleCopyCode(discount.code)}>
                            <ContentCopyIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    {discount.description && (
                      <Typography
                        variant='caption'
                        component='span'
                        color={discount.isDeleted ? 'text.disabled' : 'text.secondary'}
                        sx={{
                          display: 'block',
                          textDecoration: discount.isDeleted ? 'line-through' : 'none'
                        }}
                      >
                        {discount.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{discount.discountType === DiscountType.percentage ? 'Phần trăm' : 'Số tiền cố định'}</TableCell>
                  <TableCell>{discount.discountType === DiscountType.percentage ? `${discount.value}%` : formatCurrency(discount.value)}</TableCell>
                  <TableCell>
                    {discount.startDate && discount.endDate ? (
                      <span>
                        {formatDate(discount.startDate)} - {formatDate(discount.endDate)}
                      </span>
                    ) : (
                      <span>Không hết hạn</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' component='span'>
                      {discount.usedCount} lần sử dụng
                      {discount.maxUses !== undefined && discount.maxUses !== null && ` / tối đa ${discount.maxUses} lần`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={discount.isDeleted ? 'Đã xóa' : discount.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      color={discount.isDeleted ? 'error' : discount.isActive ? 'success' : 'default'}
                      size='small'
                      variant='outlined'
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {discount.isDeleted ? (
                        <Button variant='contained' color='success' startIcon={<RestoreIcon />} onClick={() => handleRestore(discount)}>
                          Khôi phục
                        </Button>
                      ) : (
                        <Button variant='contained' color='primary' onClick={() => handleEdit(discount)}>
                          Sửa
                        </Button>
                      )}

                      {!discount.isDeleted && (
                        <Button variant='contained' color='error' onClick={() => handleDelete(discount)} disabled={isDeletePending}>
                          Xóa
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDiscounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align='center' sx={{ py: 3 }}>
                    <Typography variant='body1' component='div' color='text.secondary'>
                      {searchTerm ? 'Không tìm thấy mã giảm giá phù hợp' : 'Không có mã giảm giá nào'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredDiscounts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Create Discount Modal */}
      <CreateDiscountModal open={createModalOpen} onClose={handleCloseCreateModal} />

      {/* Edit Discount Modal */}
      {selectedDiscount && <EditDiscountModal open={editModalOpen} onClose={handleCloseEditModal} discount={selectedDiscount} />}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title='Xóa mã giảm giá'
        message={`Bạn có chắc chắn muốn xóa mã giảm giá "${selectedDiscount?.code}"? Hành động này không thể hoàn tác.`}
        isDeleting={isDeletePending}
      />

      {/* Restore Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isRestoreDialogOpen}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleConfirmRestore}
        title='Khôi phục mã giảm giá'
        message={`Bạn có chắc chắn muốn khôi phục mã giảm giá "${selectedDiscount?.code}"?`}
        isDeleting={isUpdatePending}
        confirmButtonText='Khôi phục'
        confirmButtonColor='success'
      />
    </Box>
  )
}
