import { BrandData, CreateBrandData } from '@/hooks/apis/brand'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export interface EditBrandModalProps {
  open: boolean
  onClose: () => void
  brand: BrandData | null
  onUpdate: (id: string, data: CreateBrandData & { isDeleted?: boolean }) => void
}

export default function EditBrandModal({ open, onClose, brand, onUpdate }: EditBrandModalProps) {
  const [formData, setFormData] = useState<CreateBrandData & { isDeleted?: boolean }>({ name: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        isDeleted: brand.isDeleted
      })
    }
  }, [brand])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) errors.name = 'Tên thương hiệu là bắt buộc'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Vui lòng sửa lỗi trong biểu mẫu')
      return
    }

    if (!brand?.id) {
      toast.error('ID thương hiệu bị thiếu')
      return
    }

    setIsSubmitting(true)

    try {
      onUpdate(brand.id, formData)
    } catch (error) {
      console.error('Lỗi khi gửi biểu mẫu:', error)
      toast.error('Đã xảy ra lỗi không mong muốn')
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    if (brand) {
      setFormData({
        name: brand.name,
        isDeleted: brand.isDeleted
      })
    } else {
      setFormData({ name: '' })
    }
    setValidationErrors({})
    setIsSubmitting(false)
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
          Chỉnh sửa thương hiệu
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Tên thương hiệu'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                placeholder='Nhập tên thương hiệu'
                sx={{ mb: 2 }}
              />
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
            <Button variant='outlined' onClick={handleCancel} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type='submit' variant='contained' disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} /> : null}>
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
} 