import { PasswordField } from '@/components/popup/auth/PasswordField'
import { useFetchLogin } from '@/hooks/apis/auth'
import { QueryKey } from '@/models/QueryKey'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface LoginFormProps {
  onSuccess: (accessToken: string, role: string) => void
  onSwitchToOtp: () => void
  onSwitchToForgotPassword: () => void
}

export const LoginForm = ({ onSuccess, onSwitchToOtp, onSwitchToForgotPassword }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const { mutate: login, isPending: isLoginLoading } = useFetchLogin({
    onSuccess: data => {
      onSuccess(data.data?.accessToken || '', data.data?.role || '')
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_CART] })
      queryClient.invalidateQueries({ queryKey: [QueryKey.WISHLIST_LIST] })
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_NOTIFICATIONS_USER] })
      queryClient.invalidateQueries({ queryKey: [QueryKey.USER_PROFILE] })
    },
    onError: error => {
      toast.error(error.message || 'Đăng nhập thất bại')
      setError(error.message || 'Đăng nhập thất bại')
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

    login({
      email: formData.email,
      password: formData.password
    })
  }

  return (
    <Box component='form' onSubmit={handleSubmit}>
      <TextField fullWidth label='Email' name='email' type='email' value={formData.email} onChange={handleInputChange} required margin='normal' disabled={isLoginLoading} />
      <PasswordField name='password' label='Mật khẩu' value={formData.password} show={showPassword} setShow={setShowPassword} onChange={handleInputChange} disabled={isLoginLoading} />
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={onSwitchToOtp} sx={{ 'p': 0, 'color': 'primary.main', '&:hover': { textDecoration: 'underline' } }} disabled={isLoginLoading}>
          Đăng nhập bằng OTP
        </Button>
        <Button onClick={onSwitchToForgotPassword} sx={{ 'p': 0, 'color': 'primary.main', '&:hover': { textDecoration: 'underline' } }} disabled={isLoginLoading}>
          Quên mật khẩu?
        </Button>
      </Box>

      {error && (
        <Typography color='error' sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} disabled={isLoginLoading}>
        {isLoginLoading ? <CircularProgress size={24} color='inherit' /> : 'Đăng nhập'}
      </Button>
    </Box>
  )
}
