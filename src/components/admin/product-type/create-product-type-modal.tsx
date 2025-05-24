import { useFetchCategoryList } from '@/hooks/apis/category'
import { useFetchCreateProductType } from '@/hooks/apis/product-type'
import { SubCategoryData, useFetchSubCategoryByCategory } from '@/hooks/apis/sub-category'
import { QueryKey } from '@/models/QueryKey'
import { CreateProductTypeData } from '@/services/apis/product-type'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

export interface CreateProductTypeModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateProductTypeModal({ open, onClose }: CreateProductTypeModalProps) {
  const [formData, setFormData] = useState<CreateProductTypeData>({ name: '', subCategoryId: '' })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')

  const { data: categoriesData, isLoading: isCategoriesLoading } = useFetchCategoryList()
  const { data: subCategoriesData, isLoading: isSubCategoriesLoading } = useFetchSubCategoryByCategory(selectedCategoryId)
  const queryClient = useQueryClient()
  const { mutate: createProductType, isPending: isCreateProductTypePending } = useFetchCreateProductType({
    onSuccess: () => {
      toast.success('Tạo loại sản phẩm thành công!')
      resetForm()
      queryClient.invalidateQueries({ queryKey: [QueryKey.PRODUCT_TYPE_LIST] })
      onClose()
    },
    onError: error => {
      toast.error(error.message || "Tạo loại sản phẩm thất bại")
    }
  })

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) errors.name = 'Tên loại sản phẩm là bắt buộc'
    if (!formData.subCategoryId) errors.subCategoryId = 'Danh mục con là bắt buộc'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Vui lòng sửa lỗi trong biểu mẫu')
      return
    }
    try {
      createProductType(formData)
    } catch (error) {
      console.error('Lỗi khi gửi biểu mẫu:', error)
      toast.error('Đã xảy ra lỗi không mong muốn')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', subCategoryId: '' })
    setSelectedCategoryId('')
    setValidationErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
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

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target
    setSelectedCategoryId(value)

    // Reset subcategory when category changes
    setFormData(prev => ({
      ...prev,
      subCategoryId: ''
    }))
  }

  const handleSubCategoryChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target
    setFormData(prev => ({
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
          Tạo loại sản phẩm
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Tên loại sản phẩm'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                placeholder='Nhập tên loại sản phẩm'
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth error={!!validationErrors.categoryId} sx={{ mb: 2 }}>
                <InputLabel id='category-select-label'>Danh mục</InputLabel>
                <Select labelId='category-select-label' id='category-select' value={selectedCategoryId} label='Danh mục' onChange={handleCategoryChange} disabled={isCategoriesLoading}>
                  {categoriesData?.data.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth error={!!validationErrors.subCategoryId} disabled={!selectedCategoryId || isSubCategoriesLoading}>
                <InputLabel id='subcategory-select-label'>Danh mục con</InputLabel>
                <Select labelId='subcategory-select-label' id='subcategory-select' name='subCategoryId' value={formData.subCategoryId} label='Danh mục con' onChange={handleSubCategoryChange}>
                  {subCategoriesData?.data.map((subCategory: SubCategoryData) => (
                    <MenuItem key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.subCategoryId && <FormHelperText>{validationErrors.subCategoryId}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' onClick={handleCancel} disabled={isCreateProductTypePending}>
              Hủy
            </Button>
            <Button type='submit' variant='contained' disabled={isCreateProductTypePending}>
              {isCreateProductTypePending ? 'Đang tạo...' : 'Tạo'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}
