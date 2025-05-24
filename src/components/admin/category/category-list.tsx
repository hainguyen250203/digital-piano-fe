import CreateCategoryModal from '@/components/admin/category/create-category-modal'
import EditCategoryModal from '@/components/admin/category/edit-category-modal'
import DeleteConfirmationDialog from '@/components/admin/common/delete-confirmation-dialog'
import { CategoryData, useFetchCategoryList, useFetchDeleteCategory, useFetchUpdateCategory } from '@/hooks/apis/category'
import { QueryKey } from '@/models/QueryKey'
import { CreateCategoryData } from '@/services/apis/category'
import AddIcon from '@mui/icons-material/Add'
import RestoreIcon from '@mui/icons-material/Restore'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Chip, CircularProgress, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

export default function CategoryList() {
  // Always declare hooks first, before any conditional logic
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  // Fetch data using the hook
  const { data: categoryList, isLoading } = useFetchCategoryList()

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    const categories = categoryList?.data || []
    if (!searchQuery.trim()) return categories

    const query = searchQuery.toLowerCase()
    return categories.filter(
      (category: CategoryData) => 
        category.name.toLowerCase().includes(query) || 
        category.id.toLowerCase().includes(query)
    )
  }, [categoryList?.data, searchQuery])

  const { mutate: updateCategory, isPending: isUpdateCategoryPending } = useFetchUpdateCategory({
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công!')
      handleCloseEditModal()
      handleCloseRestoreDialog()
      setIsRestoring(false)
      queryClient.invalidateQueries({ queryKey: [QueryKey.CATEGORY_LIST] })
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  const { mutate: deleteCategory, isPending: isDeleteCategoryPending } = useFetchDeleteCategory({
    onSuccess: () => {
      toast.success('Xóa danh mục thành công!')
      queryClient.invalidateQueries({ queryKey: [QueryKey.CATEGORY_LIST] })
      handleCloseDeleteDialog()
      setIsDeleting(false)
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

  const handleEdit = (category: CategoryData) => {
    if (category.isDeleted) return
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedCategory(null)
  }

  const handleUpdate = (id: string, data: CreateCategoryData) => {
    updateCategory({ id, data })
  }

  const handleDelete = (category: CategoryData) => {
    if (category.isDeleted) return
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedCategory(null)
  }

  const handleConfirmDelete = () => {
    if (!selectedCategory) return

    setIsDeleting(true)
    deleteCategory(selectedCategory.id)
  }

  const handleRestore = (category: CategoryData) => {
    if (!category.isDeleted) return
    setSelectedCategory(category)
    setIsRestoreDialogOpen(true)
  }

  const handleCloseRestoreDialog = () => {
    setIsRestoreDialogOpen(false)
    setSelectedCategory(null)
  }

  const handleConfirmRestore = () => {
    if (!selectedCategory) return

    setIsRestoring(true)
    const data: CreateCategoryData = {
      name: selectedCategory.name,
      isDeleted: false
    }

    updateCategory({
      id: selectedCategory.id,
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
        <Typography variant='h5'>Quản lý danh mục</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm danh mục..."
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
            Tạo danh mục
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='category table'>
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
              {filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(category => (
                <TableRow
                  key={category.id}
                  sx={{
                    'backgroundColor': category.isDeleted ? 'rgba(244, 67, 54, 0.08)' : 'inherit',
                    '&:hover': {
                      backgroundColor: category.isDeleted ? 'rgba(244, 67, 54, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <TableCell>{category.id}</TableCell>
                  <TableCell>
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: category.isDeleted ? 'line-through' : 'none',
                        color: category.isDeleted ? 'text.disabled' : 'text.primary'
                      }}
                    >
                      {category.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={category.isDeleted ? 'Đã xóa' : 'Hoạt động'} color={category.isDeleted ? 'error' : 'success'} size='small' variant='outlined' />
                  </TableCell>
                  <TableCell>{new Date(category.createdAt || '').toLocaleString()}</TableCell>
                  <TableCell>{new Date(category.updatedAt || '').toLocaleString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {category.isDeleted ? (
                        <Button variant='contained' color='success' startIcon={<RestoreIcon />} onClick={() => handleRestore(category)}>
                          Khôi phục
                        </Button>
                      ) : (
                        <>
                          <Button variant='contained' color='primary' onClick={() => handleEdit(category)}>
                            Sửa
                          </Button>
                          <Button variant='contained' color='error' onClick={() => handleDelete(category)} >
                            Xóa
                          </Button>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    {searchQuery ? 'Không tìm thấy danh mục phù hợp' : 'Không có danh mục nào'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <CreateCategoryModal open={isCreateModalOpen} onClose={handleCloseCreateModal} />

      {selectedCategory && (
        <EditCategoryModal open={isEditModalOpen} onClose={handleCloseEditModal} category={selectedCategory} onUpdate={handleUpdate} isUpdateCategoryPending={isUpdateCategoryPending} />
      )}

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title='Xóa danh mục'
        message={`Bạn có chắc chắn muốn xóa "${selectedCategory?.name}"? Hành động này không thể hoàn tác.`}
        isDeleting={isDeleting || isDeleteCategoryPending}
      />

      <DeleteConfirmationDialog
        open={isRestoreDialogOpen}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleConfirmRestore}
        title='Khôi phục danh mục'
        message={`Bạn có chắc chắn muốn khôi phục "${selectedCategory?.name}"?`}
        isDeleting={isRestoring || isUpdateCategoryPending}
        confirmButtonText='Khôi phục'
        confirmButtonColor='success'
      />
    </Box>
  )
}
