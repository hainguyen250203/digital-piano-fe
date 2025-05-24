import { useAuthStore } from '@/context/AuthStoreContext'
import { useFetchLogin, useFetchRequestLoginOtp, useFetchSignup, useFetchVerifyLoginOtp } from '@/hooks/apis/auth'
import { QueryKey } from '@/models/QueryKey'
import { setAuthCookies } from '@/utils/auth'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface LoginPopupProps {
  open: boolean
  onClose: () => void
}

type FormType = 'login' | 'signup' | 'otpRequest' | 'otpVerify'

// ✅ Tách riêng component PasswordField ra ngoài để tránh mất focus khi nhập
const PasswordField = ({
  name,
  label,
  value,
  show,
  setShow,
  onChange,
  disabled
}: {
  name: string
  label: string
  value: string
  show: boolean
  setShow: (show: boolean) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}) => (
  <TextField
    fullWidth
    label={label}
    name={name}
    type={show ? 'text' : 'password'}
    value={value}
    onChange={onChange}
    required
    margin='normal'
    disabled={disabled}
    InputProps={{
      endAdornment: (
        <InputAdornment position='end'>
          <IconButton onClick={() => setShow(!show)} edge='end' disabled={disabled}>
            {show ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      )
    }}
  />
)

export default function LoginPopup({ open, onClose }: LoginPopupProps) {
  const [formType, setFormType] = useState<FormType>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: undefined,
    otp: '',
    otpSecret: ''
  })
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const setAccessToken = useAuthStore(state => state.setAccessToken)
  const setUserRole = useAuthStore(state => state.setUserRole)

  const handleAuthSuccess = (accessToken: string, role: string) => {
    setAuthCookies(accessToken, role)
    setAccessToken(accessToken)
    setUserRole(role)
    toast.success('Đăng nhập thành công!', { position: 'top-center' })
    onClose()
  }

  const { mutate: verifyLoginOtp, isPending: isVerifyLoginOtpLoading } = useFetchVerifyLoginOtp({
    onSuccess: data => {
      handleAuthSuccess(data.data?.accessToken || '', data.data?.role || '')
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

  const { mutate: login, isPending: isLoginLoading } = useFetchLogin({
    onSuccess: data => {
      handleAuthSuccess(data.data?.accessToken || '', data.data?.role || '')
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

  const { mutate: signup, isPending: isSignupLoading } = useFetchSignup({
    onSuccess: data => {
      handleAuthSuccess(data.data?.accessToken || '', data.data?.role || '')
    },
    onError: error => {
      toast.error(error.message || 'Đăng ký thất bại')
    }
  })
  const { mutate: requestLoginOtp, isPending: isRequestLoginOtpLoading } = useFetchRequestLoginOtp({
    onSuccess: data => {
      setFormData(prev => ({ ...prev, otpSecret: data.data?.otpSecret || '' }))
      setFormType('otpVerify')
    },
    onError: error => {
      toast.error(error.message || 'Gửi mã OTP thất bại')
      setError(error.message || 'Gửi mã OTP thất bại')
    }
  })

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setFormType(newValue === 0 ? 'login' : 'signup')
    setError('')
  }

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
    requestLoginOtp(formData.email)
  }

  const handleVerifyOtp = () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 chữ số')
      return
    }

    verifyLoginOtp({
      email: formData.email,
      otp: formData.otp,
      otpSecret: formData.otpSecret
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formType === 'login') {
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
    } else if (formType === 'signup') {
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
  }

  const renderForm = () => {
    const isLoading = isLoginLoading || isVerifyLoginOtpLoading || isRequestLoginOtpLoading

    switch (formType) {
      case 'login':
        return (
          <>
            <TextField fullWidth label='Email' name='email' type='email' value={formData.email} onChange={handleInputChange} required margin='normal' disabled={isLoading} />
            <PasswordField name='password' label='Mật khẩu' value={formData.password} show={showPassword} setShow={setShowPassword} onChange={handleInputChange} disabled={isLoading} />
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button onClick={() => setFormType('otpRequest')} sx={{ 'p': 0, 'color': 'primary.main', '&:hover': { textDecoration: 'underline' } }} disabled={isLoading}>
                Đăng nhập bằng OTP
              </Button>
            </Box>
          </>
        )

      case 'signup':
        return (
          <>
            <TextField fullWidth label='Email' name='email' type='email' value={formData.email} onChange={handleInputChange} required margin='normal' disabled={isLoading} />
            <PasswordField name='password' label='Mật khẩu' value={formData.password} show={showPassword} setShow={setShowPassword} onChange={handleInputChange} disabled={isLoading} />
            <PasswordField
              name='confirmPassword'
              label='Xác nhận mật khẩu'
              value={formData.confirmPassword}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <TextField fullWidth label='Số điện thoại (Tùy chọn)' name='phoneNumber' type='tel' value={formData.phoneNumber} onChange={handleInputChange} margin='normal' disabled={isLoading} />
          </>
        )

      case 'otpRequest':
        return (
          <>
            <Typography variant='body2' sx={{ mb: 2, mt: 1 }}>
              Vui lòng nhập email của bạn để nhận mã OTP đăng nhập.
            </Typography>
            <TextField fullWidth label='Email' name='email' type='email' value={formData.email} onChange={handleInputChange} required margin='normal' disabled={isLoading} />
          </>
        )

      case 'otpVerify':
        return (
          <>
            <Typography variant='body2' sx={{ mb: 2, mt: 1 }}>
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
            <Box sx={{ mt: 1 }}>
              <Button onClick={handleRequestOtp} sx={{ 'p': 0, 'color': 'primary.main', '&:hover': { textDecoration: 'underline' } }} disabled={isLoading}>
                Gửi lại mã OTP
              </Button>
            </Box>
          </>
        )
    }
  }

  const getButtonText = () => {
    if (isLoginLoading || isVerifyLoginOtpLoading || isRequestLoginOtpLoading || isSignupLoading) {
      return <CircularProgress size={24} color='inherit' />
    }

    switch (formType) {
      case 'otpRequest':
        return 'Gửi mã OTP'
      case 'otpVerify':
        return 'Xác thực OTP'
      case 'login':
        return 'Đăng nhập'
      case 'signup':
        return 'Đăng ký'
    }
  }

  const getButtonHandler = () => {
    switch (formType) {
      case 'otpRequest':
        return handleRequestOtp
      case 'otpVerify':
        return handleVerifyOtp
      default:
        return undefined
    }
  }

  const isLoading = isLoginLoading || isVerifyLoginOtpLoading || isRequestLoginOtpLoading || isSignupLoading

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Tabs value={formType === 'login' || formType === 'otpRequest' || formType === 'otpVerify' ? 0 : 1} onChange={handleTabChange} centered sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label='Đăng nhập' />
          <Tab label='Đăng ký' />
        </Tabs>
      </DialogTitle>
      <DialogContent>
        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {renderForm()}

          {error && (
            <Typography color='error' sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type={formType === 'otpRequest' || formType === 'otpVerify' ? 'button' : 'submit'}
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
            onClick={getButtonHandler()}
          >
            {getButtonText()}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
