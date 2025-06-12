import { useFetchRequestLoginOtp, useFetchVerifyLoginOtp } from '@/hooks/apis/auth'
import { QueryKey } from '@/models/QueryKey'
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface OtpLoginFormProps {
  onSuccess: (accessToken: string, role: string) => void
  onBackToLogin: () => void
}

type FormStep = 'request' | 'verify'

export const OtpLoginForm = ({ onSuccess, onBackToLogin }: OtpLoginFormProps) => {
  const [step, setStep] = useState<FormStep>('request')
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    otpSecret: ''
  })
  const [error, setError] = useState('')
  const queryClient = useQueryClient()

  const { mutate: requestOtp, isPending: isRequestOtpLoading } = useFetchRequestLoginOtp({
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

  const { mutate: verifyOtp, isPending: isVerifyOtpLoading } = useFetchVerifyLoginOtp({
    onSuccess: data => {
      onSuccess(data.data?.accessToken || '', data.data?.role || '')
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_CART] })
      queryClient.invalidateQueries({ queryKey: [QueryKey.WISHLIST_LIST] })
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_NOTIFICATIONS_USER] })
      queryClient.invalidateQueries({ queryKey: [QueryKey.USER_PROFILE] })
    },
    onError: error => {
      toast.error(error.message || 'Mã OTP không hợp lệ. Vui lòng thử lại.')
      setError(error.message || 'Mã OTP không hợp lệ')
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

    verifyOtp({
      email: formData.email,
      otp: formData.otp,
      otpSecret: formData.otpSecret
    })
  }

  const isLoading = isRequestOtpLoading || isVerifyOtpLoading

  return (
    <Box>
      <Typography variant='h6' sx={{ mb: 2 }}>
        {step === 'request' ? 'Đăng nhập bằng OTP' : 'Xác thực OTP'}
      </Typography>

      {step === 'request' ? (
        <>
          <Typography variant='body2' sx={{ mb: 2 }}>
            Vui lòng nhập email của bạn để nhận mã OTP đăng nhập.
          </Typography>
          <TextField fullWidth label='Email' name='email' type='email' value={formData.email} onChange={handleInputChange} required margin='normal' disabled={isLoading} />
        </>
      ) : (
        <>
          <Typography variant='body2' sx={{ mb: 2 }}>
            Vui lòng nhập mã OTP đã được gửi đến email của bạn.
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
          {isLoading ? <CircularProgress size={24} color='inherit' /> : step === 'request' ? 'Gửi mã OTP' : 'Xác thực OTP'}
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
