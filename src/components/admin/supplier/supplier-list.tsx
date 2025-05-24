import DeleteConfirmationDialog from '@/components/admin/common/delete-confirmation-dialog'
import CreateSupplierModal from '@/components/admin/supplier/create-supplier-modal'
import EditSupplierModal from '@/components/admin/supplier/edit-supplier-modal'
import { SupplierData, useFetchDeleteSupplier, useFetchSupplierList, useFetchUpdateSupplier } from '@/hooks/apis/supplier'
import { QueryKey } from '@/models/QueryKey'
import { UpdateSupplierData } from '@/services/apis/supplier'
import AddIcon from '@mui/icons-material/Add'
import RestoreIcon from '@mui/icons-material/Restore'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Chip, CircularProgress, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

export default function SupplierList() {
  // Always declare hooks first, before any conditional logic
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  // Fetch data using the hook
  const { data: supplierList, isLoading } = useFetchSupplierList()

  // Filter suppliers based on search query
  const filteredSuppliers = useMemo(() => {
    const suppliers = supplierList?.data || []
    if (!searchQuery.trim()) return suppliers

    const query = searchQuery.toLowerCase()
    return suppliers.filter(
      (supplier: SupplierData) => 
        supplier.name.toLowerCase().includes(query) || 
        supplier.email.toLowerCase().includes(query) || 
        supplier.phoneNumber.toLowerCase().includes(query) ||
        supplier.address.toLowerCase().includes(query)
    )
  }, [supplierList?.data, searchQuery])

  const { mutate: updateSupplier, isPending: isUpdateSupplierPending } = useFetchUpdateSupplier({
    onSuccess: () => {
      toast.success('Cập nhật nhà cung cấp thành công!')
      handleCloseEditModal()
      handleCloseRestoreDialog()
      setIsRestoring(false)
      queryClient.invalidateQueries({ queryKey: [QueryKey.SUPPLIER_LIST] })
    },
    onError: error => {
      toast.error(error.message || "Cập nhật nhà cung cấp thất bại")
      setIsRestoring(false)
    }
  })

  const { mutate: deleteSupplier, isPending: isDeleteSupplierPending } = useFetchDeleteSupplier({
    onSuccess: () => {
      toast.success('Xóa nhà cung cấp thành công!')
      handleCloseDeleteDialog()
      setIsDeleting(false)
      queryClient.invalidateQueries({ queryKey: [QueryKey.SUPPLIER_LIST] })
    },
    onError: error => {
      toast.error(error.message)
      setIsDeleting(false)
    }
  })

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const handleEdit = (supplier: SupplierData) => {
    if (supplier.isDeleted) return
    setSelectedSupplier(supplier)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedSupplier(null)
  }

  const handleUpdate = (id: string, data: UpdateSupplierData) => {
    updateSupplier({ id, data })
  }

  const handleDelete = (supplier: SupplierData) => {
    if (supplier.isDeleted) return
    setSelectedSupplier(supplier)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedSupplier(null)
  }

  const handleConfirmDelete = () => {
    if (!selectedSupplier) return

    setIsDeleting(true)
    deleteSupplier(selectedSupplier.id)
  }

  const handleRestore = (supplier: SupplierData) => {
    if (!supplier.isDeleted) return
    setSelectedSupplier(supplier)
    setIsRestoreDialogOpen(true)
  }

  const handleCloseRestoreDialog = () => {
    setIsRestoreDialogOpen(false)
    setSelectedSupplier(null)
  }

  const handleConfirmRestore = () => {
    if (!selectedSupplier) return

    setIsRestoring(true)
    const data: UpdateSupplierData = {
      name: selectedSupplier.name,
      email: selectedSupplier.email,
      phoneNumber: selectedSupplier.phoneNumber,
      address: selectedSupplier.address,
      isDeleted: false
    }

    updateSupplier({
      id: selectedSupplier.id,
      data
    })
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setPage(0) // Reset to first page when search changes
  }

  // Show loading state
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
        <Typography variant='h5'>Quản lý nhà cung cấp</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm nhà cung cấp..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          <Button variant='contained' startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
            Tạo nhà cung cấp
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='supplier table'>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Điện thoại</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày cập nhật</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((supplier: SupplierData) => (
                <TableRow
                  key={supplier.id}
                  sx={{
                    'backgroundColor': supplier.isDeleted ? 'rgba(244, 67, 54, 0.08)' : 'inherit',
                    '&:hover': {
                      backgroundColor: supplier.isDeleted ? 'rgba(244, 67, 54, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <TableCell>{supplier.id}</TableCell>
                  <TableCell>
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: supplier.isDeleted ? 'line-through' : 'none',
                        color: supplier.isDeleted ? 'text.disabled' : 'text.primary'
                      }}
                    >
                      {supplier.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phoneNumber}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>
                    <Chip label={supplier.isDeleted ? 'Đã xóa' : 'Hoạt động'} color={supplier.isDeleted ? 'error' : 'success'} size='small' variant='outlined' />
                  </TableCell>
                  <TableCell>{new Date(supplier.createdAt || '').toLocaleString()}</TableCell>
                  <TableCell>{new Date(supplier.updatedAt || '').toLocaleString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {supplier.isDeleted ? (
                        <Button variant='contained' color='success' startIcon={<RestoreIcon />} onClick={() => handleRestore(supplier)}>
                          Khôi phục
                        </Button>
                      ) : (
                        <Button variant='contained' color='primary' onClick={() => handleEdit(supplier)}>
                          Sửa
                        </Button>
                      )}

                      {!supplier.isDeleted && (
                        <Button variant='contained' color='error' onClick={() => handleDelete(supplier)}>
                          Xóa
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSuppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align='center'>
                    {searchQuery ? 'Không tìm thấy nhà cung cấp phù hợp' : 'Không có nhà cung cấp nào'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredSuppliers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <CreateSupplierModal open={isCreateModalOpen} onClose={handleCloseCreateModal} />

      {selectedSupplier && (
        <EditSupplierModal 
          open={isEditModalOpen} 
          onClose={handleCloseEditModal} 
          supplier={selectedSupplier} 
          onUpdate={handleUpdate} 
          isUpdateSupplierPending={isUpdateSupplierPending} 
        />
      )}

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title='Xóa nhà cung cấp'
        message={`Bạn có chắc chắn muốn xóa "${selectedSupplier?.name}"? Hành động này không thể hoàn tác.`}
        isDeleting={isDeleting || isDeleteSupplierPending}
      />

      <DeleteConfirmationDialog
        open={isRestoreDialogOpen}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleConfirmRestore}
        title='Khôi phục nhà cung cấp'
        message={`Bạn có chắc chắn muốn khôi phục "${selectedSupplier?.name}"?`}
        isDeleting={isRestoring || isUpdateSupplierPending}
        confirmButtonText='Khôi phục'
        confirmButtonColor='success'
      />
    </Box>
  )
}
