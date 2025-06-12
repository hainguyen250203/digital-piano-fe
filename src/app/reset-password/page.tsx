'use client'

import { PasswordField } from '@/components/popup/auth/PasswordField'
import { AuthStoreProvider, useAuthStore } from '@/context/AuthStoreContext'
import { useFetchVerifyForgotPasswordOtp } from '@/hooks/apis/auth'
import { Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { toast } from 'react-toastify'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const otpSecret = searchParams.get('otpSecret')
  const otp = searchParams.get('otp')

  const setAccessToken = useAuthStore(state => state.setAccessToken)
  const setUserRole = useAuthStore(state => state.setUserRole)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')

  const { mutate: verifyOtp, isPending: isVerifyOtpLoading } = useFetchVerifyForgotPasswordOtp({
    onSuccess: data => {
      toast.success('Đặt lại mật khẩu thành công!')
      setAccessToken(data.data.accessToken)
      setUserRole(data.data.role)
      router.push('/')
    },
    onError: error => {
      toast.error(error.message || 'Đặt lại mật khẩu thất bại')
      setError(error.message || 'Đặt lại mật khẩu thất bại')
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

  const validatePassword = (password: string) => password.length >= 6

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!otp || otp.length !== 6) {
      setError('Mã OTP không hợp lệ')
      return
    }

    if (!validatePassword(formData.newPassword)) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu không khớp')
      return
    }

    if (!email || !otpSecret) {
      setError('Link đặt lại mật khẩu không hợp lệ')
      return
    }

    verifyOtp({
      email,
      otp,
      otpSecret,
      newPassword: formData.newPassword
    })
  }

  if (!email || !otpSecret || !otp) {
    return (
      <Container maxWidth='sm' sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography color='error' variant='h6'>
            Link đặt lại mật khẩu không hợp lệ
          </Typography>
          <Button variant='contained' onClick={() => router.push('/')} sx={{ mt: 2 }}>
            Quay lại trang chủ
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant='h5' component='h1' align='center' gutterBottom>
          Đặt lại mật khẩu
        </Typography>
        <Typography variant='body2' color='text.secondary' align='center' sx={{ mb: 3 }}>
          Vui lòng nhập mật khẩu mới cho tài khoản của bạn
        </Typography>

        <Box component='form' onSubmit={handleSubmit}>
          <PasswordField
            name='newPassword'
            label='Mật khẩu mới'
            value={formData.newPassword}
            show={showPassword}
            setShow={setShowPassword}
            onChange={handleInputChange}
            disabled={isVerifyOtpLoading}
          />
          <PasswordField
            name='confirmPassword'
            label='Xác nhận mật khẩu mới'
            value={formData.confirmPassword}
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
            onChange={handleInputChange}
            disabled={isVerifyOtpLoading}
          />

          {error && (
            <Typography color='error' sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button type='submit' fullWidth variant='contained' size='large' sx={{ mt: 3 }} disabled={isVerifyOtpLoading}>
            {isVerifyOtpLoading ? <CircularProgress size={24} color='inherit' /> : 'Đặt lại mật khẩu'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default function ResetPasswordPage() {
  return (
    <AuthStoreProvider>
      <Suspense
        fallback={
          <Container maxWidth='sm' sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress />
            </Paper>
          </Container>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </AuthStoreProvider>
  )
}
