'use client'

import { DiscountData, DiscountType, UpdateDiscountData, useFetchUpdateDiscount } from '@/hooks/apis/discount'
import { QueryKey } from '@/models/QueryKey'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import PercentIcon from '@mui/icons-material/Percent'
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
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export interface EditDiscountModalProps {
  open: boolean
  onClose: () => void
  discount: DiscountData | null
}

export default function EditDiscountModal({ open, onClose, discount }: EditDiscountModalProps) {
  // Form state
  const [formData, setFormData] = useState<UpdateDiscountData>({
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
  const queryClient = useQueryClient()
  // Update discount mutation
  const { mutate: updateDiscount, isPending } = useFetchUpdateDiscount({
    onSuccess: () => {
      toast.success('Cập nhật mã giảm giá thành công')
      queryClient.invalidateQueries({ queryKey: [QueryKey.DISCOUNT_LIST] })
      onClose()
    },
    onError: error => {
      toast.error(error.message || 'Không thể cập nhật mã giảm giá')
    }
  })

  // Initialize form with discount data when it changes
  useEffect(() => {
    if (discount) {
      setFormData({
        code: discount.code,
        description: discount.description || '',
        discountType: discount.discountType,
        value: discount.value,
        startDate: discount.startDate || undefined,
        endDate: discount.endDate || undefined,
        maxUses: discount.maxUses || undefined,
        minOrderTotal: discount.minOrderTotal || undefined,
        maxDiscountValue: discount.maxDiscountValue || undefined,
        isActive: discount.isActive
      })
    }
  }, [discount])

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.code?.trim()) {
      newErrors.code = 'Mã giảm giá là bắt buộc'
    }

    if (formData.value !== undefined && formData.value <= 0) {
      newErrors.value = 'Giá trị phải lớn hơn 0'
    }

    if (formData.discountType === DiscountType.percentage && formData.value && formData.value > 100) {
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
    if (!validateForm() || !discount) {
      toast.error('Vui lòng sửa lỗi trong biểu mẫu')
      return
    }

    updateDiscount({ id: discount.id, data: formData })
  }

  if (!discount) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <EditIcon sx={{ mr: 1 }} />
          Chỉnh sửa mã giảm giá
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box mt={1}>
          {/* Discount Code Info */}
          <Box mb={3} p={2} bgcolor="background.default" borderRadius={1}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Mã giảm giá"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  error={!!errors.code}
                  helperText={errors.code}
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Số lần đã sử dụng
                </Typography>
                <Typography variant="body1">{discount.usedCount} lần</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Ngày tạo
                </Typography>
                <Typography variant="body1">{new Date(discount.createdAt).toLocaleDateString()}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Cập nhật gần nhất
                </Typography>
                <Typography variant="body1">{new Date(discount.updatedAt).toLocaleDateString()}</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Basic Information */}
          <Typography variant="h6" gutterBottom>
            Thông tin cơ bản
          </Typography>

          <Grid container spacing={2} mb={3}>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Loại giảm giá</InputLabel>
                <Select name="discountType" value={formData.discountType} label="Loại giảm giá" onChange={handleSelectChange}>
                  <MenuItem value={DiscountType.percentage}>Phần trăm (%)</MenuItem>
                  <MenuItem value={DiscountType.fixed}>Số tiền cố định (VND)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Giá trị"
                name="value"
                type="number"
                value={formData.value}
                onChange={e => handleNumberChange('value', e.target.value)}
                error={!!errors.value}
                helperText={errors.value}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{formData.discountType === DiscountType.percentage ? <PercentIcon /> : 'VND'}</InputAdornment>
                }}
              />
            </Grid>

            <Grid size={12}>
              <FormControlLabel control={<Switch checked={formData.isActive} onChange={handleSwitchChange} name="isActive" />} label="Đang hoạt động" />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                multiline
                rows={2}
                placeholder="Thêm mô tả tùy chọn cho mã giảm giá này"
              />
            </Grid>
          </Grid>

          {/* Date Range */}
          <Typography variant="h6" gutterBottom>
            Thời gian hiệu lực
          </Typography>

          <Grid container spacing={2} mb={3}>
            <Grid size={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Ngày bắt đầu"
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
                  label="Ngày kết thúc"
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
          <Typography variant="h6" gutterBottom>
            Giới hạn (Tùy chọn)
          </Typography>

          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Số lần sử dụng tối đa"
                name="maxUses"
                type="number"
                value={formData.maxUses === undefined ? '' : formData.maxUses}
                onChange={e => handleNumberChange('maxUses', e.target.value)}
                placeholder="Để trống nếu không giới hạn"
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Tổng giá trị đơn hàng tối thiểu"
                name="minOrderTotal"
                type="number"
                value={formData.minOrderTotal === undefined ? '' : formData.minOrderTotal}
                onChange={e => handleNumberChange('minOrderTotal', e.target.value)}
                placeholder="Số tiền đơn hàng tối thiểu"
                InputProps={{
                  startAdornment: <InputAdornment position="start">VND</InputAdornment>
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>

            {formData.discountType === DiscountType.percentage && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Giá trị giảm giá tối đa"
                  name="maxDiscountValue"
                  type="number"
                  value={formData.maxDiscountValue === undefined ? '' : formData.maxDiscountValue}
                  onChange={e => handleNumberChange('maxDiscountValue', e.target.value)}
                  placeholder="Số tiền giảm giá tối đa"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">VND</InputAdornment>
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
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isPending} startIcon={isPending ? <CircularProgress size={20} /> : null}>
          {isPending ? 'Đang cập nhật...' : 'Cập nhật mã giảm giá'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
