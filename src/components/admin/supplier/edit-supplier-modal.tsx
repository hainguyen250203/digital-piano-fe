import { SupplierData } from '@/hooks/apis/supplier'
import { UpdateSupplierData } from '@/services/apis/supplier'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export interface EditSupplierModalProps {
  open: boolean
  onClose: () => void
  supplier: SupplierData | null
  onUpdate: (id: string, data: UpdateSupplierData) => void
  isUpdateSupplierPending?: boolean
}

export default function EditSupplierModal({ open, onClose, supplier, onUpdate, isUpdateSupplierPending = false }: EditSupplierModalProps) {
  const [formData, setFormData] = useState<UpdateSupplierData>({ name: '', email: '', phoneNumber: '', address: '', isDeleted: false })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        email: supplier.email,
        phoneNumber: supplier.phoneNumber,
        address: supplier.address,
        isDeleted: supplier.isDeleted
      })
    }
  }, [supplier])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) errors.name = 'Tên nhà cung cấp là bắt buộc'
    if (!formData.email?.trim()) errors.email = 'Email là bắt buộc'
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Vui lòng nhập địa chỉ email hợp lệ'
    }
    if (!formData.phoneNumber?.trim()) errors.phoneNumber = 'Số điện thoại là bắt buộc'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Vui lòng sửa lỗi trong biểu mẫu')
      return
    }

    if (!supplier?.id) {
      toast.error('ID nhà cung cấp bị thiếu')
      return
    }

    try {
      onUpdate(supplier.id, formData)
    } catch (error) {
      console.error('Lỗi khi gửi biểu mẫu:', error)
      toast.error('Đã xảy ra lỗi không mong muốn')
    }
  }

  const resetForm = () => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        email: supplier.email,
        phoneNumber: supplier.phoneNumber,
        address: supplier.address,
        isDeleted: supplier.isDeleted
      })
    } else {
      setFormData({ name: '', email: '', phoneNumber: '', address: '', isDeleted: false })
    }
    setValidationErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: UpdateSupplierData) => ({
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
    setFormData((prev: UpdateSupplierData) => ({
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
          Chỉnh sửa nhà cung cấp
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Tên nhà cung cấp'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                placeholder='Nhập tên nhà cung cấp'
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                placeholder='Nhập địa chỉ email'
                type='email'
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Điện thoại'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                error={!!validationErrors.phoneNumber}
                helperText={validationErrors.phoneNumber}
                placeholder='Nhập số điện thoại'
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Địa chỉ'
                name='address'
                value={formData.address}
                onChange={handleChange}
                error={!!validationErrors.address}
                helperText={validationErrors.address}
                placeholder='Nhập địa chỉ'
                multiline
                rows={3}
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
            <Button variant='outlined' onClick={handleCancel} disabled={isUpdateSupplierPending}>
              Hủy
            </Button>
            <Button type='submit' variant='contained' disabled={isUpdateSupplierPending} startIcon={isUpdateSupplierPending ? <CircularProgress size={20} /> : null}>
              {isUpdateSupplierPending ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}
