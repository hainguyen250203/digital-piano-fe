import { useFetchSignup } from '@/hooks/apis/auth'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { PasswordField } from './PasswordField'

interface SignupFormProps {
  onSuccess: (accessToken: string, role: string) => void
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  })
  const [error, setError] = useState('')

  const { mutate: signup, isPending: isSignupLoading } = useFetchSignup({
    onSuccess: data => {
      onSuccess(data.data?.accessToken || '', data.data?.role || '')
    },
    onError: error => {
      toast.error(error.message || 'Đăng ký thất bại')
      setError(error.message || 'Đăng ký thất bại')
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (password: string) => password.length >= 6

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(formData.email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ')
      return
    }
    if (!validatePassword(formData.password)) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp')
      return
    }

    signup({
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber || undefined
    })
  }

  return (
    <Box component='form' onSubmit={handleSubmit}>
      <TextField fullWidth label='Email' name='email' type='email' value={formData.email} onChange={handleInputChange} required margin='normal' disabled={isSignupLoading} />
      <PasswordField name='password' label='Mật khẩu' value={formData.password} show={showPassword} setShow={setShowPassword} onChange={handleInputChange} disabled={isSignupLoading} />
      <PasswordField
        name='confirmPassword'
        label='Xác nhận mật khẩu'
        value={formData.confirmPassword}
        show={showConfirmPassword}
        setShow={setShowConfirmPassword}
        onChange={handleInputChange}
        disabled={isSignupLoading}
      />
      <TextField fullWidth label='Số điện thoại (Tùy chọn)' name='phoneNumber' type='tel' value={formData.phoneNumber} onChange={handleInputChange} margin='normal' disabled={isSignupLoading} />

      {error && (
        <Typography color='error' sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} disabled={isSignupLoading}>
        {isSignupLoading ? <CircularProgress size={24} color='inherit' /> : 'Đăng ký'}
      </Button>
    </Box>
  )
}
