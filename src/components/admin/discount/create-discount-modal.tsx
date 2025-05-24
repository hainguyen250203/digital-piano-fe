"use client"

import { CreateDiscountData, DiscountType, useFetchCreateDiscount } from '@/hooks/apis/discount'
import CloseIcon from '@mui/icons-material/Close'
import PercentIcon from '@mui/icons-material/Percent'
import ReceiptIcon from '@mui/icons-material/Receipt'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useState } from 'react'
import { toast } from 'react-toastify'

export interface CreateDiscountModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateDiscountModal({ open, onClose }: CreateDiscountModalProps) {
  // Form state
  const [formData, setFormData] = useState<CreateDiscountData>({
    code: '',
    description: '',
    discountType: DiscountType.percentage,
    value: 0,
    startDate: undefined,
    endDate: undefined,
    maxUses: undefined,
    minOrderTotal: undefined,
    maxDiscountValue: undefined,
    isActive: true
  })

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Create discount mutation
  const { mutate: createDiscount, isPending } = useFetchCreateDiscount({
    onSuccess: () => {
      toast.success('Mã giảm giá đã được tạo thành công')
      resetForm()
      onClose()
    },
    onError: error => {
      toast.error(error.message || 'Không thể tạo mã giảm giá')
    }
  })

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.code.trim()) {
      newErrors.code = 'Mã giảm giá là bắt buộc'
    }

    if (formData.value <= 0) {
      newErrors.value = 'Giá trị phải lớn hơn 0'
    }

    if (formData.discountType === DiscountType.percentage && formData.value > 100) {
      newErrors.value = 'Phần trăm không thể vượt quá 100%'
    }

    // Date validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      if (start > end) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle number input changes
  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === '' ? undefined : Number(value)
    setFormData(prev => ({ ...prev, [name]: numValue }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle select changes
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle date changes
  const handleDateChange = (name: string, date: Date | null) => {
    setFormData(prev => ({ 
      ...prev, 
      [name]: date ? date.toISOString() : undefined 
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle switch change
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isActive: e.target.checked }))
  }

  // Form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Vui lòng sửa lỗi trong biểu mẫu')
      return
    }

    createDiscount(formData)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: DiscountType.percentage,
      value: 0,
      startDate: undefined,
      endDate: undefined,
      maxUses: undefined,
      minOrderTotal: undefined,
      maxDiscountValue: undefined,
      isActive: true
    })
    setErrors({})
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptIcon sx={{ mr: 1 }} />
          Tạo mã giảm giá mới
        </Box>
        <IconButton 
          aria-label='close'
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8 
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>
          {/* Basic Information */}
          <Typography variant='h6' gutterBottom>
            Thông tin cơ bản
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Mã giảm giá *'
                name='code'
                value={formData.code}
                onChange={handleChange}
                error={!!errors.code}
                helperText={errors.code}
                placeholder='Ví dụ: SUMMER2023'
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Loại giảm giá *</InputLabel>
                <Select name='discountType' value={formData.discountType} label='Loại giảm giá *' onChange={handleSelectChange}>
                  <MenuItem value={DiscountType.percentage}>Phần trăm (%)</MenuItem>
                  <MenuItem value={DiscountType.fixed}>Số tiền cố định (VND)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={12}>
              <TextField
                fullWidth
                label='Giá trị *'
                name='value'
                type='number'
                value={formData.value}
                onChange={e => handleNumberChange('value', e.target.value)}
                error={!!errors.value}
                helperText={errors.value}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{formData.discountType === DiscountType.percentage ? <PercentIcon /> : 'VND'}</InputAdornment>
                }}
              />
            </Grid>
            
            <Grid size={12}>
              <FormControlLabel control={<Switch checked={formData.isActive} onChange={handleSwitchChange} name='isActive' />} label='Đang hoạt động' />
            </Grid>
            
            <Grid size={12}>
              <TextField
                fullWidth
                label='Mô tả'
                name='description'
                value={formData.description || ''}
                onChange={handleChange}
                multiline
                rows={2}
                placeholder='Thêm mô tả tùy chọn cho mã giảm giá này'
              />
            </Grid>
          </Grid>
          
          {/* Date Range */}
          <Typography variant='h6' gutterBottom>
            Thời gian hiệu lực
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label='Ngày bắt đầu'
                  value={formData.startDate ? new Date(formData.startDate) : null}
                  onChange={date => handleDateChange('startDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label='Ngày kết thúc'
                  value={formData.endDate ? new Date(formData.endDate) : null}
                  onChange={date => handleDateChange('endDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          
          {/* Restrictions */}
          <Typography variant='h6' gutterBottom>
            Giới hạn (Tùy chọn)
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label='Số lần sử dụng tối đa'
                name='maxUses'
                type='number'
                value={formData.maxUses === undefined ? '' : formData.maxUses}
                onChange={e => handleNumberChange('maxUses', e.target.value)}
                placeholder='Để trống nếu không giới hạn'
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid size={12}>
              <TextField
                fullWidth
                label='Tổng giá trị đơn hàng tối thiểu'
                name='minOrderTotal'
                type='number'
                value={formData.minOrderTotal === undefined ? '' : formData.minOrderTotal}
                onChange={e => handleNumberChange('minOrderTotal', e.target.value)}
                placeholder='Số tiền đơn hàng tối thiểu'
                InputProps={{
                  startAdornment: <InputAdornment position='start'>VND</InputAdornment>
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            {formData.discountType === DiscountType.percentage && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  label='Giá trị giảm giá tối đa'
                  name='maxDiscountValue'
                  type='number'
                  value={formData.maxDiscountValue === undefined ? '' : formData.maxDiscountValue}
                  onChange={e => handleNumberChange('maxDiscountValue', e.target.value)}
                  placeholder='Số tiền giảm giá tối đa'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>VND</InputAdornment>
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Hủy
        </Button>
        <Button variant='contained' color='primary' onClick={handleSubmit} disabled={isPending} startIcon={isPending ? <CircularProgress size={20} /> : null}>
          {isPending ? 'Đang tạo...' : 'Tạo mã giảm giá'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
 