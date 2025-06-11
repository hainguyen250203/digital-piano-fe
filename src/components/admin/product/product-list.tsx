'use client'

import DeleteConfirmationDialog from '@/components/admin/common/delete-confirmation-dialog'
import CreateProductModal from '@/components/admin/product/create-product-modal'
import EditProductModal from '@/components/admin/product/edit-product-modal'
import ViewProductModal from '@/components/admin/product/view-product-modal'
import { useFetchDeleteProduct, useFetchProductDetail, useFetchUpdateProduct } from '@/hooks/apis/product'
import { ProductListData } from '@/types/product.type'
import { formatCurrency } from '@/utils/format'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import RestoreIcon from '@mui/icons-material/Restore'
import SearchIcon from '@mui/icons-material/Search'
import FeaturedIcon from '@mui/icons-material/Star'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FireIcon from '@mui/icons-material/Whatshot'
import { Box, Button, Chip, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

export default function ProductList({ products }: { products: ProductListData[] }) {
  // STATE DECLARATIONS
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  const [createProductModalOpen, setCreateProductModalOpen] = useState(false)
  const [editProductModalOpen, setEditProductModalOpen] = useState(false)
  const [viewProductModalOpen, setViewProductModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  // HOOKS
  const { data: selectedProduct } = useFetchProductDetail(selectedProductId || '')

  const { mutate: updateProduct, isPending: isUpdateProductPending } = useFetchUpdateProduct({
    onSuccess: () => {
      toast.success('Cập nhật sản phẩm thành công!')
      handleCloseEditModal()
      handleCloseRestoreDialog()
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  const { mutate: deleteProduct, isPending: isDeleteProductPending } = useFetchDeleteProduct({
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công!')
      handleCloseDeleteDialog()
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products

    const query = searchQuery.toLowerCase()
    return products.filter(
      product =>
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        product.brand.name.toLowerCase().includes(query) ||
        product.subCategory.name.toLowerCase().includes(query) ||
        (product.productType?.name || '').toLowerCase().includes(query)
    )
  }, [products, searchQuery])

  // EVENT HANDLERS
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPage(0)
  }

  const handleEdit = (productId: string) => {
    setSelectedProductId(productId)
    setEditProductModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditProductModalOpen(false)
    setSelectedProductId(null)
  }

  const handleDelete = (productId: string) => {
    setSelectedProductId(productId)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedProductId(null)
  }

  const handleConfirmDelete = () => {
    if (!selectedProductId) return
    deleteProduct(selectedProductId)
  }

  const handleRestore = (productId: string) => {
    setSelectedProductId(productId)
    setIsRestoreDialogOpen(true)
  }

  const handleCloseRestoreDialog = () => {
    setIsRestoreDialogOpen(false)
    setSelectedProductId(null)
  }

  const handleConfirmRestore = () => {
    if (!selectedProductId || !selectedProduct?.data) return
    // Create a form data with isDeleted set to false
    const formData = new FormData()
    formData.append('isDeleted', 'false') // Set isDeleted to false
    updateProduct({ id: selectedProductId, data: formData })
  }

  const handleView = (productId: string) => {
    setSelectedProductId(productId)
    setViewProductModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setViewProductModalOpen(false)
    setSelectedProductId(null)
  }

  return (
    <>
      <Box mb={2} display='flex' justifyContent='space-between' gap={2} alignItems='center'>
        <Typography variant='h5'>Quản lý sản phẩm</Typography>
        <Box display='flex' gap={2} alignItems='center'>
          <TextField
            placeholder='Tìm kiếm sản phẩm'
            variant='outlined'
            size='small'
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            style={{ minWidth: 250 }}
          />
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => setCreateProductModalOpen(true)}>
            Tạo sản phẩm
          </Button>
        </Box>
      </Box>
      <Paper style={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer style={{ maxHeight: '100%' }}>
          <Table stickyHeader aria-label='simple table' style={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Giá khuyến mãi</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Bán chạy</TableCell>
                <TableCell>Nổi bật</TableCell>
                <TableCell>Danh mục con</TableCell>
                <TableCell>Loại sản phẩm</TableCell>
                <TableCell>Thương hiệu</TableCell>
                <TableCell>Tồn kho</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align='center'>
                    {searchQuery ? 'Không tìm thấy sản phẩm phù hợp' : 'Không có sản phẩm nào'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  const isDeleted = row.isDeleted
                  return (
                    <TableRow
                      hover
                      key={row.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: isDeleted ? 'rgba(244, 67, 54, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <TableCell>
                        <Typography
                          component='span'
                          color={isDeleted ? 'text.disabled' : 'text.primary'}
                          style={{
                            textDecoration: isDeleted ? 'line-through' : 'none'
                          }}
                        >
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {row.defaultImage ? (
                          <Box component='img' src={row.defaultImage?.url} alt={row.name} width={50} height={50} borderRadius={1} style={{ objectFit: 'cover' }} />
                        ) : (
                          <Box width={50} height={50} bgcolor='grey.200' display='flex' alignItems='center' justifyContent='center' borderRadius={1} fontSize='10px' color='text.secondary'>
                            Không có ảnh
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(row.price)}</TableCell>
                      <TableCell>{row.salePrice ? formatCurrency(row.salePrice) : '-'}</TableCell>
                      <TableCell>
                        <Chip label={isDeleted ? 'Đã xóa' : 'Hoạt động'} color={isDeleted ? 'error' : 'success'} size='small' variant='outlined' />
                      </TableCell>
                      <TableCell>
                        <Chip icon={<FireIcon />} label={row.isHotSale ? 'Có' : 'Không'} color={row.isHotSale ? 'error' : 'default'} size='small' variant='outlined' />
                      </TableCell>
                      <TableCell>
                        <Chip icon={<FeaturedIcon />} label={row.isFeatured ? 'Có' : 'Không'} color={row.isFeatured ? 'warning' : 'default'} size='small' variant='outlined' />
                      </TableCell>
                      <TableCell>{row.subCategory.name}</TableCell>
                      <TableCell>{row.productType?.name}</TableCell>
                      <TableCell>{row.brand.name}</TableCell>
                      <TableCell>{row.stock?.quantity || '-'}</TableCell>
                      <TableCell>
                        <Box display='flex' gap={1}>
                          {isDeleted ? (
                            <Tooltip title='Khôi phục'>
                              <IconButton color='success' onClick={() => handleRestore(row.id)}>
                                <RestoreIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <>
                              <Tooltip title='Xem'>
                                <IconButton color='info' onClick={() => handleView(row.id)}>
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Sửa'>
                                <IconButton color='primary' onClick={() => handleEdit(row.id)}>
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Xóa'>
                                <IconButton color='error' onClick={() => handleDelete(row.id)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component='div'
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Modals */}
      <CreateProductModal open={createProductModalOpen} onClose={() => setCreateProductModalOpen(false)} />

      {selectedProduct?.data && <EditProductModal open={editProductModalOpen} onClose={handleCloseEditModal} product={selectedProduct.data} />}

      {selectedProduct?.data && <ViewProductModal open={viewProductModalOpen} onClose={handleCloseViewModal} product={selectedProduct.data} />}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title='Xóa sản phẩm'
        message={`Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.`}
        isDeleting={isDeleteProductPending}
      />

      {/* Restore Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isRestoreDialogOpen}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleConfirmRestore}
        title='Khôi phục sản phẩm'
        message={`Bạn có chắc chắn muốn khôi phục sản phẩm này?`}
        isDeleting={isUpdateProductPending}
        confirmButtonText='Khôi phục'
        confirmButtonColor='success'
      />
    </>
  )
}
