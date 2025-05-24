import CreateBrandModal from '@/components/admin/brand/create-brand-modal'
import EditBrandModal from '@/components/admin/brand/edit-brand-modal'
import DeleteConfirmationDialog from '@/components/admin/common/delete-confirmation-dialog'
import { BrandData, CreateBrandData, useFetchBrandList, useFetchDeleteBrand, useFetchUpdateBrand } from '@/hooks/apis/brand'
import { QueryKey } from '@/models/QueryKey'
import AddIcon from '@mui/icons-material/Add'
import RestoreIcon from '@mui/icons-material/Restore'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Chip, CircularProgress, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

export default function BrandList() {
  // Always declare hooks first, before any conditional logic
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  // All React hooks must be called before any conditional returns
  const { data: brandList, isLoading } = useFetchBrandList()

  // Filter brands based on search query
  const filteredBrands = useMemo(() => {
    const brands = brandList?.data || []
    if (!searchQuery.trim()) return brands

    const query = searchQuery.toLowerCase()
    return brands.filter(
      (brand: BrandData) => 
        brand.name.toLowerCase().includes(query) || 
        brand.id.toLowerCase().includes(query)
    )
  }, [brandList?.data, searchQuery])

  const { mutate: updateBrand, isPending: isUpdateBrandPending } = useFetchUpdateBrand({
    onSuccess: () => {
      toast.success('Cập nhật thương hiệu thành công!')
      handleCloseEditModal()
      handleCloseRestoreDialog()
    },
    onError: error => {
      toast.error(`Không thể cập nhật thương hiệu: ${error.message}`)
    }
  })

  const { mutate: deleteBrand, isPending: isDeleteBrandPending } = useFetchDeleteBrand({
    onSuccess: () => {
      toast.success('Xóa thương hiệu thành công!')
      queryClient.invalidateQueries({ queryKey: [QueryKey.BRAND_LIST] })
      handleCloseDeleteDialog()
    },
    onError: error => {
      toast.error(`Không thể xóa thương hiệu: ${error.message}`)
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

  const handleEdit = (brand: BrandData) => {
    if (brand.isDeleted) return
    setSelectedBrand(brand)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedBrand(null)
  }

  const handleUpdate = (id: string, data: CreateBrandData) => {
    updateBrand({ id, data })
  }

  const handleDelete = (brand: BrandData) => {
    if (brand.isDeleted) return
    setSelectedBrand(brand)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedBrand(null)
  }

  const handleConfirmDelete = () => {
    if (!selectedBrand) return
    deleteBrand(selectedBrand.id)
  }

  const handleRestore = (brand: BrandData) => {
    if (!brand.isDeleted) return
    setSelectedBrand(brand)
    setIsRestoreDialogOpen(true)
  }

  const handleCloseRestoreDialog = () => {
    setIsRestoreDialogOpen(false)
    setSelectedBrand(null)
  }

  const handleConfirmRestore = () => {
    if (!selectedBrand) return
    
    const data: CreateBrandData = {
      name: selectedBrand.name,
      isDeleted: false
    }
    
    updateBrand({ 
      id: selectedBrand.id, 
      data
    })
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setPage(0) // Reset to first page when search changes
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
        <Typography variant='h5'>Quản lý thương hiệu</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm thương hiệu..."
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
            Tạo thương hiệu
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='brand table'>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày cập nhật</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBrands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(brand => (
                <TableRow 
                  key={brand.id}
                  sx={{ 
                    backgroundColor: brand.isDeleted ? 'rgba(244, 67, 54, 0.08)' : 'inherit',
                    '&:hover': {
                      backgroundColor: brand.isDeleted ? 'rgba(244, 67, 54, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <TableCell>{brand.id}</TableCell>
                  <TableCell>
                    <Typography 
                      component="span"
                      sx={{ 
                        textDecoration: brand.isDeleted ? 'line-through' : 'none',
                        color: brand.isDeleted ? 'text.disabled' : 'text.primary'
                      }}
                    >
                      {brand.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={brand.isDeleted ? 'Đã xóa' : 'Hoạt động'}
                      color={brand.isDeleted ? 'error' : 'success'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{new Date(brand.createdAt || '').toLocaleString()}</TableCell>
                  <TableCell>{new Date(brand.updatedAt || '').toLocaleString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {brand.isDeleted ? (
                        <Button 
                          variant='contained' 
                          color='success'
                          startIcon={<RestoreIcon />}
                          onClick={() => handleRestore(brand)}
                        >
                          Khôi phục
                        </Button>
                      ) : (
                        <Button variant='contained' color='primary' onClick={() => handleEdit(brand)}>
                          Sửa
                        </Button>
                      )}
                      
                      {!brand.isDeleted && (
                        <Button variant='contained' color='error' onClick={() => handleDelete(brand)}>
                          Xóa
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBrands.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    {searchQuery ? 'Không tìm thấy thương hiệu phù hợp' : 'Không có thương hiệu nào'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredBrands.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <CreateBrandModal open={isCreateModalOpen} onClose={handleCloseCreateModal} />

      {selectedBrand && <EditBrandModal open={isEditModalOpen} onClose={handleCloseEditModal} brand={selectedBrand} onUpdate={handleUpdate} />}

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title='Xóa thương hiệu'
        message={`Bạn có chắc chắn muốn xóa "${selectedBrand?.name}"? Hành động này không thể hoàn tác.`}
        isDeleting={isDeleteBrandPending}
      />

      <DeleteConfirmationDialog
        open={isRestoreDialogOpen}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleConfirmRestore}
        title='Khôi phục thương hiệu'
        message={`Bạn có chắc chắn muốn khôi phục "${selectedBrand?.name}"?`}
        isDeleting={isUpdateBrandPending}
        confirmButtonText="Khôi phục"
        confirmButtonColor="success"
      />
    </Box>
  )
}
