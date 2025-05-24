import DeleteConfirmationDialog from '@/components/admin/common/delete-confirmation-dialog'
import CreateSubCategoryModal from '@/components/admin/subcategory/create-subcategory-modal'
import EditSubCategoryModal from '@/components/admin/subcategory/edit-subcategory-modal'
import { SubCategoryData, useFetchDeleteSubCategory, useFetchSubCategoryList, useFetchUpdateSubCategory } from '@/hooks/apis/sub-category'
import { QueryKey } from '@/models/QueryKey'
import { CreateSubCategoryData } from '@/services/apis/sub-category'
import AddIcon from '@mui/icons-material/Add'
import RestoreIcon from '@mui/icons-material/Restore'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Chip, CircularProgress, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

export default function SubCategoryList() {
  // Always declare hooks first, before any conditional logic
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategoryData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  // Fetch data using the hook
  const { data: subcategoryList, isLoading } = useFetchSubCategoryList()

  // Filter subcategories based on search query
  const filteredSubcategories = useMemo(() => {
    const subcategories = subcategoryList?.data || []
    if (!searchQuery.trim()) return subcategories

    const query = searchQuery.toLowerCase()
    return subcategories.filter(
      (subcategory: SubCategoryData) => 
        subcategory.name.toLowerCase().includes(query) || 
        subcategory.category?.name?.toLowerCase().includes(query) || 
        subcategory.id.toLowerCase().includes(query)
    )
  }, [subcategoryList?.data, searchQuery])

  const { mutate: updateSubCategory, isPending: isUpdateSubCategoryPending } = useFetchUpdateSubCategory({
    onSuccess: () => {
      toast.success('Cập nhật danh mục con thành công!')
      handleCloseEditModal()
      handleCloseRestoreDialog()
      setIsRestoring(false)
      queryClient.invalidateQueries({ queryKey: [QueryKey.SUB_CATEGORY_LIST] })
    },
    onError: error => {
      toast.error(error.message || "Cập nhật danh mục con thất bại")
      setIsRestoring(false)
    }
  })

  const { mutate: deleteSubCategory, isPending: isDeleteSubCategoryPending } = useFetchDeleteSubCategory({
    onSuccess: () => {
      toast.success('Xóa danh mục con thành công!')
      handleCloseDeleteDialog()
      setIsDeleting(false)
      queryClient.invalidateQueries({ queryKey: [QueryKey.SUB_CATEGORY_LIST] })
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

  const handleEdit = (subcategory: SubCategoryData) => {
    if (subcategory.isDeleted) return
    setSelectedSubcategory(subcategory)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedSubcategory(null)
  }

  const handleUpdate = (id: string, data: CreateSubCategoryData) => {
    updateSubCategory({ id, data })
  }

  const handleDelete = (subcategory: SubCategoryData) => {
    if (subcategory.isDeleted) return
    setSelectedSubcategory(subcategory)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedSubcategory(null)
  }

  const handleConfirmDelete = () => {
    if (!selectedSubcategory) return

    setIsDeleting(true)
    deleteSubCategory(selectedSubcategory.id)
  }

  const handleRestore = (subcategory: SubCategoryData) => {
    if (!subcategory.isDeleted) return
    setSelectedSubcategory(subcategory)
    setIsRestoreDialogOpen(true)
  }

  const handleCloseRestoreDialog = () => {
    setIsRestoreDialogOpen(false)
    setSelectedSubcategory(null)
  }

  const handleConfirmRestore = () => {
    if (!selectedSubcategory) return

    setIsRestoring(true)
    const data: CreateSubCategoryData = {
      name: selectedSubcategory.name,
      categoryId: selectedSubcategory.category?.id || '',
      isDeleted: false
    }

    updateSubCategory({
      id: selectedSubcategory.id,
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
        <Typography variant='h5'>Quản lý danh mục con</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm danh mục con..."
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
            Tạo danh mục con
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='subcategory table'>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày cập nhật</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubcategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(subcategory => (
                <TableRow
                  key={subcategory.id}
                  sx={{
                    'backgroundColor': subcategory.isDeleted ? 'rgba(244, 67, 54, 0.08)' : 'inherit',
                    '&:hover': {
                      backgroundColor: subcategory.isDeleted ? 'rgba(244, 67, 54, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <TableCell>{subcategory.id}</TableCell>
                  <TableCell>
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: subcategory.isDeleted ? 'line-through' : 'none',
                        color: subcategory.isDeleted ? 'text.disabled' : 'text.primary'
                      }}
                    >
                      {subcategory.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{subcategory.category?.name}</TableCell>
                  <TableCell>
                    <Chip label={subcategory.isDeleted ? 'Đã xóa' : 'Hoạt động'} color={subcategory.isDeleted ? 'error' : 'success'} size='small' variant='outlined' />
                  </TableCell>
                  <TableCell>{new Date(subcategory.createdAt || '').toLocaleString()}</TableCell>
                  <TableCell>{new Date(subcategory.updatedAt || '').toLocaleString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {subcategory.isDeleted ? (
                        <Button variant='contained' color='success' startIcon={<RestoreIcon />} onClick={() => handleRestore(subcategory)}>
                          Khôi phục
                        </Button>
                      ) : (
                        <Button variant='contained' color='primary' onClick={() => handleEdit(subcategory)}>
                          Sửa
                        </Button>
                      )}

                      {!subcategory.isDeleted && (
                        <Button variant='contained' color='error' onClick={() => handleDelete(subcategory)}>
                          Xóa
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSubcategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    {searchQuery ? 'Không tìm thấy danh mục con phù hợp' : 'Không có danh mục con nào'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredSubcategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <CreateSubCategoryModal open={isCreateModalOpen} onClose={handleCloseCreateModal} />

      {selectedSubcategory && <EditSubCategoryModal open={isEditModalOpen} onClose={handleCloseEditModal} subcategory={selectedSubcategory} onUpdate={handleUpdate} isUpdateSubCategoryPending={isUpdateSubCategoryPending} />}

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title='Xóa danh mục con'
        message={`Bạn có chắc chắn muốn xóa "${selectedSubcategory?.name}"? Hành động này không thể hoàn tác.`}
        isDeleting={isDeleting || isDeleteSubCategoryPending}
      />

      <DeleteConfirmationDialog
        open={isRestoreDialogOpen}
        onClose={handleCloseRestoreDialog}
        onConfirm={handleConfirmRestore}
        title='Khôi phục danh mục con'
        message={`Bạn có chắc chắn muốn khôi phục "${selectedSubcategory?.name}"?`}
        isDeleting={isRestoring || isUpdateSubCategoryPending}
        confirmButtonText='Khôi phục'
        confirmButtonColor='success'
      />
    </Box>
  )
}
