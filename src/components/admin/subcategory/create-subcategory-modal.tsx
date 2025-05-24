import { CategoryData, useFetchCategoryList } from '@/hooks/apis/category'
import { useFetchCreateSubCategory } from '@/hooks/apis/sub-category'
import { QueryKey } from '@/models/QueryKey'
import { CreateSubCategoryData } from '@/services/apis/sub-category'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

export interface CreateSubCategoryModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateSubCategoryModal({ open, onClose }: CreateSubCategoryModalProps) {
  const [formData, setFormData] = useState<CreateSubCategoryData>({ name: '', categoryId: '' })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const { data: categoriesData, isLoading: isCategoriesLoading } = useFetchCategoryList()
  const queryClient = useQueryClient()
  const { mutate: createSubCategory, isPending: isCreateSubCategoryPending } = useFetchCreateSubCategory({
    onSuccess: () => {
      toast.success('Tạo danh mục con thành công!')
      queryClient.invalidateQueries({ queryKey: [QueryKey.SUB_CATEGORY_LIST] })
      resetForm()
      onClose()
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) errors.name = 'Tên danh mục con là bắt buộc'
    if (!formData.categoryId) errors.categoryId = 'Danh mục là bắt buộc'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Vui lòng sửa lỗi trong biểu mẫu')
      return
    }
    createSubCategory(formData)
  }

  const resetForm = () => {
    setFormData({ name: '', categoryId: '' })
    setValidationErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: CreateSubCategoryData) => ({
      ...prev,
      [name]: value
    }))

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target
    setFormData((prev: CreateSubCategoryData) => ({
      ...prev,
      [name]: value
    }))

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCancel = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '400px' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Typography variant='h6' sx={{ mb: 3, pr: 4 }}>
          Tạo danh mục con
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label='Tên danh mục con'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                placeholder='Nhập tên danh mục con'
              />
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth error={!!validationErrors.categoryId}>
                <InputLabel id='category-select-label'>Danh mục</InputLabel>
                <Select
                  labelId='category-select-label'
                  id='category-select'
                  name='categoryId'
                  value={formData.categoryId}
                  label='Danh mục'
                  onChange={handleSelectChange}
                  disabled={isCategoriesLoading}
                >
                  {categoriesData?.data.map((category: CategoryData) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.categoryId && <FormHelperText>{validationErrors.categoryId}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' onClick={handleCancel} disabled={isCreateSubCategoryPending}>
              Hủy
            </Button>
            <Button type='submit' variant='contained' disabled={isCreateSubCategoryPending}>
              {isCreateSubCategoryPending ? 'Đang tạo...' : 'Tạo'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}
