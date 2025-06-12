import { useAuthStore } from '@/context/AuthStoreContext'
import { useFetchRequestForgotPasswordOtp, useFetchVerifyForgotPasswordOtp } from '@/hooks/apis/auth'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { PasswordField } from './PasswordField'

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
}

type FormStep = 'request' | 'verify'

export const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const [step, setStep] = useState<FormStep>('request')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    otpSecret: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const setAccessToken = useAuthStore(state => state.setAccessToken)
  const setUserRole = useAuthStore(state => state.setUserRole)

  const { mutate: requestOtp, isPending: isRequestOtpLoading } = useFetchRequestForgotPasswordOtp({
    onSuccess: data => {
      setFormData(prev => ({ ...prev, otpSecret: data.data?.otpSecret || '' }))
      setStep('verify')
      toast.success('Mã OTP đã được gửi đến email của bạn')
    },
    onError: error => {
      toast.error(error.message || 'Gửi mã OTP thất bại')
      setError(error.message || 'Gửi mã OTP thất bại')
    }
  })

  const { mutate: verifyOtp, isPending: isVerifyOtpLoading } = useFetchVerifyForgotPasswordOtp({
    onSuccess: data => {
      toast.success('Đặt lại mật khẩu thành công!')
      setAccessToken(data.data.accessToken)
      setUserRole(data.data.role)
      onBackToLogin()
    },
    onError: error => {
      toast.error(error.message || 'Xác thực OTP thất bại')
      setError(error.message || 'Xác thực OTP thất bại')
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

  const handleRequestOtp = async () => {
    if (!validateEmail(formData.email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ')
      return
    }
    requestOtp(formData.email)
  }

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 chữ số')
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

    verifyOtp({
      email: formData.email,
      otp: formData.otp,
      otpSecret: formData.otpSecret,
      newPassword: formData.newPassword
    })
  }

  const isLoading = isRequestOtpLoading || isVerifyOtpLoading

  return (
    <Box>
      <Typography variant='h6' sx={{ mb: 2 }}>
        {step === 'request' ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
      </Typography>

      {step === 'request' ? (
        <>
          <Typography variant='body2' sx={{ mb: 2 }}>
            Vui lòng nhập email của bạn để nhận mã OTP đặt lại mật khẩu.
          </Typography>
          <TextField fullWidth label='Email' name='email' type='email' value={formData.email} onChange={handleInputChange} required margin='normal' disabled={isLoading} />
        </>
      ) : (
        <>
          <Typography variant='body2' sx={{ mb: 2 }}>
            Vui lòng nhập mã OTP đã được gửi đến email của bạn và mật khẩu mới.
          </Typography>
          <TextField
            fullWidth
            label='Mã OTP'
            name='otp'
            value={formData.otp}
            onChange={handleInputChange}
            required
            margin='normal'
            disabled={isLoading}
            inputProps={{
              maxLength: 6,
              pattern: '[0-9]*'
            }}
          />
          <PasswordField name='newPassword' label='Mật khẩu mới' value={formData.newPassword} show={showPassword} setShow={setShowPassword} onChange={handleInputChange} disabled={isLoading} />
          <PasswordField
            name='confirmPassword'
            label='Xác nhận mật khẩu mới'
            value={formData.confirmPassword}
            show={showConfirmPassword}
            setShow={setShowConfirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </>
      )}

      {error && (
        <Typography color='error' sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button variant='outlined' onClick={onBackToLogin} disabled={isLoading} sx={{ flex: 1 }}>
          Quay lại
        </Button>
        <Button variant='contained' onClick={step === 'request' ? handleRequestOtp : handleVerifyOtp} disabled={isLoading} sx={{ flex: 1 }}>
          {isLoading ? <CircularProgress size={24} color='inherit' /> : step === 'request' ? 'Gửi mã OTP' : 'Đặt lại mật khẩu'}
        </Button>
      </Box>

      {step === 'verify' && (
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Button onClick={handleRequestOtp} sx={{ 'p': 0, 'color': 'primary.main', '&:hover': { textDecoration: 'underline' } }} disabled={isLoading}>
            Gửi lại mã OTP
          </Button>
        </Box>
      )}
    </Box>
  )
}
