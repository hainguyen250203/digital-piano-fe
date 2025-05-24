import { CreateBrandData, useFetchCreateBrand } from '@/hooks/apis/brand'
import { QueryKey } from '@/models/QueryKey'
import { BaseResponse } from '@/types/base-response'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Grid, IconButton, Modal, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

export interface CreateBrandModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateBrandModal({ open, onClose }: CreateBrandModalProps) {
  const [formData, setFormData] = useState<CreateBrandData>({ name: '' })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const queryClient = useQueryClient()
  const { mutate: createBrand, isPending: isPendingCreating } = useFetchCreateBrand({
    onSuccess: () => {
      toast.success('Tạo thương hiệu thành công!')
      queryClient.invalidateQueries({ queryKey: [QueryKey.BRAND_LIST] })
      resetForm()
      onClose()
    },
    onError: (error: BaseResponse<null>) => {
      toast.error(error.message)
    }
  })

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

    try {
      createBrand(formData)
    } catch (error) {
      console.error('Lỗi khi gửi biểu mẫu:', error)
      toast.error('Đã xảy ra lỗi không mong muốn')
    }
  }

  const resetForm = () => {
    setFormData({ name: '' })
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
          Tạo thương hiệu
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
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' onClick={handleCancel} disabled={isPendingCreating}>
              Hủy
            </Button>
            <Button type='submit' variant='contained' disabled={isPendingCreating}>
              TẠO
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}
