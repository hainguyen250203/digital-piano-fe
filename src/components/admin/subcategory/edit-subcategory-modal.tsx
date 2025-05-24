import { CategoryData, useFetchCategoryList } from '@/hooks/apis/category'
import { SubCategoryData } from '@/hooks/apis/sub-category'
import { CreateSubCategoryData } from '@/services/apis/sub-category'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export interface EditSubCategoryModalProps {
  open: boolean
  onClose: () => void
  subcategory: SubCategoryData | null
  onUpdate: (id: string, data: CreateSubCategoryData) => void
  isUpdateSubCategoryPending?: boolean
}

export default function EditSubCategoryModal({ open, onClose, subcategory, onUpdate, isUpdateSubCategoryPending = false }: EditSubCategoryModalProps) {
  const [formData, setFormData] = useState<CreateSubCategoryData>({ name: '', categoryId: '' })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const { data: categoriesData, isLoading: isCategoriesLoading } = useFetchCategoryList()

  useEffect(() => {
    if (subcategory) {
      setFormData({
        name: subcategory.name,
        categoryId: subcategory.category?.id || '',
        isDeleted: subcategory.isDeleted
      })
    }
  }, [subcategory])

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

    if (!subcategory?.id) {
      toast.error('ID danh mục con không tồn tại')
      return
    }

    try {
      onUpdate(subcategory.id, formData)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Đã xảy ra lỗi không mong muốn')
    }
  }

  const resetForm = () => {
    if (subcategory) {
      setFormData({
        name: subcategory.name,
        categoryId: subcategory.category?.id || '',
        isDeleted: subcategory.isDeleted
      })
    } else {
      setFormData({ name: '', categoryId: '' })
    }
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === 'true'
    setFormData(prev => ({
      ...prev,
      isDeleted: value
    }))
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
          Chỉnh sửa danh mục con
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
            <Grid size={12} sx={{ mb: 2 }}>
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
            <Grid size={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Trạng thái</FormLabel>
                <RadioGroup 
                  row 
                  name="status" 
                  value={formData.isDeleted?.toString() || 'false'} 
                  onChange={handleStatusChange}
                >
                  <FormControlLabel value="false" control={<Radio />} label="Hoạt động" />
                  <FormControlLabel value="true" control={<Radio />} label="Đã xóa" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' onClick={handleCancel} disabled={isUpdateSubCategoryPending}>
              Hủy
            </Button>
            <Button type='submit' variant='contained' disabled={isUpdateSubCategoryPending} startIcon={isUpdateSubCategoryPending ? <CircularProgress size={20} /> : null}>
              {isUpdateSubCategoryPending ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
} 