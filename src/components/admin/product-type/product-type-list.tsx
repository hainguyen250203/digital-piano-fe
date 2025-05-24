import DeleteConfirmationDialog from '@/components/admin/common/delete-confirmation-dialog'
import CreateProductTypeModal from '@/components/admin/product-type/create-product-type-modal'
import EditProductTypeModal from '@/components/admin/product-type/edit-product-type-modal'
import { ProductTypeData, useFetchDeleteProductType, useFetchProductTypeList, useFetchUpdateProductType } from '@/hooks/apis/product-type'
import { QueryKey } from '@/models/QueryKey'
import { CreateProductTypeData } from '@/services/apis/product-type'
import AddIcon from '@mui/icons-material/Add'
import RestoreIcon from '@mui/icons-material/Restore'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Chip, CircularProgress, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

export default function ProductTypeList() {
  // Always declare hooks first, before any conditional logic
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedProductType, setSelectedProductType] = useState<ProductTypeData | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  // Fetch data using the hook
  const { data: productTypeList, isLoading } = useFetchProductTypeList()

  // Filter product types based on search query
  const filteredProductTypes = useMemo(() => {
    const productTypes = productTypeList?.data || []
    if (!searchQuery.trim()) return productTypes

    const query = searchQuery.toLowerCase()
    return productTypes.filter(
      (productType: ProductTypeData) => 
        productType.name.toLowerCase().includes(query) || 
        productType.id.toLowerCase().includes(query) ||
        productType.subCategory?.name?.toLowerCase().includes(query)
    )
  }, [productTypeList?.data, searchQuery])

  const { mutate: updateProductType, isPending: isUpdateProductTypePending } = useFetchUpdateProductType({
    onSuccess: () => {
      toast.success('Cập nhật loại sản phẩm thành công!')
      handleCloseEditModal()
      handleCloseRestoreDialog()
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_TYPE_LIST] })
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật loại sản phẩm thất bại")
    }
  })

  const { mutate: deleteProductType, isPending: isDeleteProductTypePending } = useFetchDeleteProductType({
    onSuccess: () => {
      toast.success('Xóa loại sản phẩm thành công!')
      handleCloseDeleteDialog()
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_TYPE_LIST] })
    },
    onError: (error) => {
      toast.error(`Không thể xóa loại sản phẩm: ${error.message}`)
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
  
  const handleEdit = (productType: ProductTypeData) => {
    if (productType.isDeleted) return
    setSelectedProductType(productType)
    setIsEditModalOpen(true)
  }
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedProductType(null)
  }

  const handleUpdate = (id: string, data: CreateProductTypeData) => {
    updateProductType({ id, data })
  }
  
  const handleDelete = (productType: ProductTypeData) => {
    if (productType.isDeleted) return
    setSelectedProductType(productType)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedProductType(null)
  }

  const handleConfirmDelete = () => {
    if (!selectedProductType) return
    deleteProductType(selectedProductType.id)
  }

  const handleRestore = (productType: ProductTypeData) => {
    if (!productType.isDeleted) return
    setSelectedProductType(productType)
    setIsRestoreDialogOpen(true)
  }

  const handleCloseRestoreDialog = () => {
    setIsRestoreDialogOpen(false)
    setSelectedProductType(null)
  }

  const handleConfirmRestore = () => {
    if (!selectedProductType) return
    
    const data: CreateProductTypeData = {
      name: selectedProductType.name,
      subCategoryId: selectedProductType.subCategoryId || selectedProductType.subCategory?.id || '',
      isDeleted: false
    }
    
    updateProductType({ 
      id: selectedProductType.id, 
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
        <Typography variant='h5'>Quản lý loại sản phẩm</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm loại sản phẩm..."
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
            Tạo loại sản phẩm
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="product type table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Danh mục con</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày cập nhật</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProductTypes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(productType => (
                  <TableRow 
                    key={productType.id}
                    sx={{ 
                      backgroundColor: productType.isDeleted ? 'rgba(244, 67, 54, 0.08)' : 'inherit',
                      '&:hover': {
                        backgroundColor: productType.isDeleted ? 'rgba(244, 67, 54, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <TableCell>{productType.id}</TableCell>
                    <TableCell>
                      <Typography 
                        component="span"
                        sx={{ 
                          textDecoration: productType.isDeleted ? 'line-through' : 'none',
                          color: productType.isDeleted ? 'text.disabled' : 'text.primary'
                        }}
                      >
                        {productType.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{productType.subCategory?.name || productType.subCategoryId}</TableCell>
                    <TableCell>
                      <Chip 
                        label={productType.isDeleted ? 'Đã xóa' : 'Hoạt động'}
                        color={productType.isDeleted ? 'error' : 'success'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{new Date(productType.createdAt || '').toLocaleString()}</TableCell>
                    <TableCell>{new Date(productType.updatedAt || '').toLocaleString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {productType.isDeleted ? (
                          <Button 
                            variant='contained' 
                            color='success'
                            startIcon={<RestoreIcon />}
                            onClick={() => handleRestore(productType)}
                          >
                            Khôi phục
                          </Button>
                        ) : (
                          <>
                            <Button variant='contained' color='primary' onClick={() => handleEdit(productType)}>
                              Sửa
                            </Button>
                            <Button variant='contained' color='error' onClick={() => handleDelete(productType)}>
                              Xóa
                            </Button>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredProductTypes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    {searchQuery ? 'Không tìm thấy loại sản phẩm phù hợp' : 'Không có loại sản phẩm nào'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProductTypes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <CreateProductTypeModal open={isCreateModalOpen} onClose={handleCloseCreateModal} />
      
      {selectedProductType && (
        <EditProductTypeModal 
          open={isEditModalOpen} 
          onClose={handleCloseEditModal} 
          productType={selectedProductType} 
          onUpdate={handleUpdate} 
          isUpdateProductTypePending={isUpdateProductTypePending} 
        />
      )}

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title='Xóa loại sản phẩm'
        message={`Bạn có chắc chắn muốn xóa "${selectedProductType?.name}"? Hành động này không thể hoàn tác.`}
        isDeleting={isDeleteProductTypePending}
      />

      <DeleteConfirmationDialog
        open={isRestoreDialogOpen}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleConfirmRestore}
        title='Khôi phục loại sản phẩm'
        message={`Bạn có chắc chắn muốn khôi phục "${selectedProductType?.name}"?`}
        isDeleting={isUpdateProductTypePending}
        confirmButtonText='Khôi phục'
        confirmButtonColor='success'
      />
    </Box>
  )
}
