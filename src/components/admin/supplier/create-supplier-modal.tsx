import { useFetchCreateSupplier } from '@/hooks/apis/supplier'
import { QueryKey } from '@/models/QueryKey'
import { CreateSupplierData } from '@/services/apis/supplier'
import { BaseResponse } from '@/types/base-response'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Grid, IconButton, Modal, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

export interface CreateSupplierModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateSupplierModal({ open, onClose }: CreateSupplierModalProps) {
  const [formData, setFormData] = useState<CreateSupplierData>({ name: '', email: '', phoneNumber: '', address: '' })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const queryClient = useQueryClient()
  const { mutate: createSupplier, isPending: isCreateSupplierPending } = useFetchCreateSupplier({
    onSuccess: () => {
      toast.success('Tạo nhà cung cấp thành công!')
      queryClient.invalidateQueries({ queryKey: [QueryKey.SUPPLIER_LIST] })
      resetForm()
      onClose()
    },
    onError: (err: BaseResponse<null>) => {
      toast.error(err.message)
    }
  })

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
    createSupplier(formData)
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', phoneNumber: '', address: '' })
    setValidationErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: CreateSupplierData) => ({
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
          Tạo nhà cung cấp
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
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' onClick={handleCancel} disabled={isCreateSupplierPending}>
              Hủy
            </Button>
            <Button type='submit' variant='contained' disabled={isCreateSupplierPending}>
              {isCreateSupplierPending ? 'Đang tạo...' : 'Tạo'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}
