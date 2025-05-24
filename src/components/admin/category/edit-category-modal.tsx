import { CategoryData } from '@/hooks/apis/category'
import { CreateCategoryData } from '@/services/apis/category'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export interface EditCategoryModalProps {
  open: boolean
  onClose: () => void
  category: CategoryData | null
  onUpdate: (id: string, data: CreateCategoryData) => void
  isUpdateCategoryPending: boolean
}

export default function EditCategoryModal({ open, onClose, category, onUpdate, isUpdateCategoryPending }: EditCategoryModalProps) {
  const [formData, setFormData] = useState<CreateCategoryData>({ name: '' })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        isDeleted: category.isDeleted
      })
    }
  }, [category])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) errors.name = 'Tên danh mục là bắt buộc'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Vui lòng sửa lỗi trong biểu mẫu')
      return
    }

    if (!category?.id) {
      toast.error('ID danh mục bị thiếu')
      return
    }
    try {
      onUpdate(category.id, formData)
    } catch (error) {
      console.error('Lỗi khi gửi biểu mẫu:', error)
      toast.error('Đã xảy ra lỗi không mong muốn')
    }
  }

  const resetForm = () => {
    if (category) {
      setFormData({
        name: category.name,
        isDeleted: category.isDeleted
      })
    } else {
      setFormData({ name: '' })
    }
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
          Chỉnh sửa danh mục
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Tên danh mục'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                placeholder='Nhập tên danh mục'
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={12}>
              <FormControl component='fieldset'>
                <FormLabel component='legend'>Trạng thái</FormLabel>
                <RadioGroup row name='status' value={formData.isDeleted?.toString() || 'false'} onChange={handleStatusChange}>
                  <FormControlLabel value='false' control={<Radio />} label='Hoạt động' />
                  <FormControlLabel value='true' control={<Radio />} label='Đã xóa' />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' onClick={handleCancel} disabled={isUpdateCategoryPending}>
              Hủy
            </Button>
            <Button type='submit' variant='contained' disabled={isUpdateCategoryPending}>
              Cập nhật
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}
