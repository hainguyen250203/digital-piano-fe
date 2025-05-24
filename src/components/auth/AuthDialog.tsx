'use client'

import { fetchLogin, fetchRequestForgotPasswordOtp, fetchRequestLoginOtp, fetchSignUp, fetchVerifyForgotPasswordOtp, fetchVerifyLoginOtp } from '@/services/apis/auth'
import CloseIcon from '@mui/icons-material/Close'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Alert, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

interface AuthDialogProps {
  open: boolean
  onClose: () => void
}

interface FormData {
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  otp: string
  otpSecret: string
  newPassword: string
  confirmNewPassword: string
}

type FormType = 'login' | 'signup' | 'forgot' | 'loginOtpRequest' | 'loginOtpVerify' | 'forgotOtpRequest' | 'forgotOtpVerify'

// API Error type for better error handling
interface ApiError {
  message: string
  errorCode?: number
  data?: unknown
}

export default function AuthDialog({ open, onClose }: AuthDialogProps) {
  const [formType, setFormType] = useState<FormType>('login')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [apiError, setApiError] = useState<string>('')
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    otp: '',
    otpSecret: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (apiError) {
      setApiError('')
    }
  }

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const validateLoginForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSignupForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp'
    }

    if (formData.phoneNumber && !/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateEmailOnlyForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateOtpForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.otp) {
      newErrors.otp = 'Mã OTP là bắt buộc'
    } else if (!/^[0-9]{6}$/.test(formData.otp)) {
      newErrors.otp = 'Mã OTP phải có 6 chữ số'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateResetPasswordForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.otp) {
      newErrors.otp = 'Mã OTP là bắt buộc'
    } else if (!/^[0-9]{6}$/.test(formData.otp)) {
      newErrors.otp = 'Mã OTP phải có 6 chữ số'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Xác nhận mật khẩu mới là bắt buộc'
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Mật khẩu không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateLoginForm()) return

    setLoading(true)
    setApiError('')

    try {
      await fetchLogin({
        email: formData.email,
        password: formData.password
      })

      showSnackbar('Đăng nhập thành công!', 'success')
      onClose() // Close dialog after successful login
    } catch (error: unknown) {
      console.error('Login error:', error)
      if (typeof error === 'object' && error !== null && 'message' in error) {
        setApiError((error as ApiError).message)
      } else {
        setApiError('Đăng nhập thất bại. Vui lòng thử lại.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    if (!validateSignupForm()) return

    setLoading(true)
    setApiError('')

    try {
      await fetchSignUp({
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber || undefined
      })

      showSnackbar('Đăng ký thành công!', 'success')
      // Switch to login form after successful registration
      setFormType('login')
    } catch (error: unknown) {
      console.error('Signup error:', error)
      if (typeof error === 'object' && error !== null && 'message' in error) {
        setApiError((error as ApiError).message)
      } else {
        setApiError('Đăng ký thất bại. Vui lòng thử lại.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRequestLoginOtp = async () => {
    if (!validateEmailOnlyForm()) return

    setLoading(true)
    setApiError('')

    try {
      const response = await fetchRequestLoginOtp({
        email: formData.email
      })

      // Store otpSecret received from server
      setFormData(prev => ({ ...prev, otpSecret: response.data?.otpSecret || '' }))
      showSnackbar('Mã OTP đã được gửi đến email của bạn!', 'success')
      setFormType('loginOtpVerify')
    } catch (error: unknown) {
      console.error('Request OTP error:', error)
      if (typeof error === 'object' && error !== null && 'message' in error) {
        setApiError((error as ApiError).message)
      } else {
        setApiError('Không thể gửi mã OTP. Vui lòng thử lại.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyLoginOtp = async () => {
    if (!validateOtpForm()) return

    setLoading(true)
    setApiError('')

    try {
      await fetchVerifyLoginOtp({
        email: formData.email,
        otp: formData.otp,
        otpSecret: formData.otpSecret
      })

      showSnackbar('Xác thực OTP thành công!', 'success')
      onClose() // Close dialog after successful login
    } catch (error: unknown) {
      console.error('Verify OTP error:', error)
      if (typeof error === 'object' && error !== null && 'message' in error) {
        setApiError((error as ApiError).message)
      } else {
        setApiError('Mã OTP không hợp lệ. Vui lòng thử lại.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRequestForgotPasswordOtp = async () => {
    if (!validateEmailOnlyForm()) return

    setLoading(true)
    setApiError('')

    try {
      const response = await fetchRequestForgotPasswordOtp({
        email: formData.email
      })

      // Store otpSecret received from server
      setFormData(prev => ({ ...prev, otpSecret: response.data.otpSecret }))
      showSnackbar('Mã OTP đã được gửi đến email của bạn!', 'success')
      setFormType('forgotOtpVerify')
    } catch (error: unknown) {
      console.error('Request forgot password OTP error:', error)
      if (typeof error === 'object' && error !== null && 'message' in error) {
        setApiError((error as ApiError).message)
      } else {
        setApiError('Không thể gửi mã OTP. Vui lòng thử lại.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyForgotPasswordOtp = async () => {
    if (!validateResetPasswordForm()) return

    setLoading(true)
    setApiError('')

    try {
      await fetchVerifyForgotPasswordOtp({
        email: formData.email,
        otp: formData.otp,
        otpSecret: formData.otpSecret,
        newPassword: formData.newPassword
      })

      showSnackbar('Mật khẩu đã được đặt lại thành công!', 'success')
      setFormType('login')
    } catch (error: unknown) {
      console.error('Verify forgot password OTP error:', error)
      if (typeof error === 'object' && error !== null && 'message' in error) {
        setApiError((error as ApiError).message)
      } else {
        setApiError('Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    switch (formType) {
      case 'login':
        handleLogin()
        break
      case 'signup':
        handleSignup()
        break
      case 'forgot':
        handleRequestForgotPasswordOtp()
        break
      case 'loginOtpRequest':
        handleRequestLoginOtp()
        break
      case 'loginOtpVerify':
        handleVerifyLoginOtp()
        break
      case 'forgotOtpRequest':
        handleRequestForgotPasswordOtp()
        break
      case 'forgotOtpVerify':
        handleVerifyForgotPasswordOtp()
        break
      default:
        break
    }
  }

  const getTitle = () => {
    switch (formType) {
      case 'login':
        return 'Đăng nhập'
      case 'signup':
        return 'Đăng ký'
      case 'forgot':
      case 'forgotOtpRequest':
        return 'Quên mật khẩu'
      case 'loginOtpRequest':
        return 'Đăng nhập bằng OTP'
      case 'loginOtpVerify':
        return 'Xác thực OTP'
      case 'forgotOtpVerify':
        return 'Đặt lại mật khẩu'
      default:
        return ''
    }
  }

  const renderFormByType = () => {
    switch (formType) {
      case 'login':
        return (
          <>
            <TextField
              margin='normal'
              required
              fullWidth
              label='Email'
              name='email'
              autoComplete='email'
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Mật khẩu'
              type={showPassword ? 'text' : 'password'}
              autoComplete='current-password'
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge='end' aria-label='toggle password visibility' disabled={loading}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setFormType('loginOtpRequest')}
                sx={{
                  'p': 0,
                  'color': '#006837',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                disabled={loading}
              >
                Đăng nhập bằng OTP
              </Button>
            </Box>
          </>
        )

      case 'signup':
        return (
          <>
            <TextField
              margin='normal'
              required
              fullWidth
              label='Email'
              name='email'
              autoComplete='email'
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Mật khẩu'
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge='end' aria-label='toggle password visibility' disabled={loading}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='confirmPassword'
              label='Xác nhận mật khẩu'
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge='end' aria-label='toggle confirm password visibility' disabled={loading}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin='normal'
              fullWidth
              name='phoneNumber'
              label='Số điện thoại (tùy chọn)'
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              disabled={loading}
            />
          </>
        )

      case 'forgot':
      case 'loginOtpRequest':
      case 'forgotOtpRequest':
        return (
          <>
            <Typography variant='body2' sx={{ mb: 2, mt: 1 }}>
              {formType === 'loginOtpRequest' ? 'Vui lòng nhập email của bạn để nhận mã OTP đăng nhập.' : 'Vui lòng nhập email của bạn để nhận mã OTP đặt lại mật khẩu.'}
            </Typography>
            <TextField
              margin='normal'
              required
              fullWidth
              label='Email'
              name='email'
              autoComplete='email'
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
            />
          </>
        )

      case 'loginOtpVerify':
        return (
          <>
            <Typography variant='body2' sx={{ mb: 2, mt: 1 }}>
              Vui lòng nhập mã OTP đã được gửi đến email.
            </Typography>
            <TextField
              margin='normal'
              required
              fullWidth
              label='Mã OTP'
              name='otp'
              autoFocus
              value={formData.otp}
              onChange={handleInputChange}
              error={!!errors.otp}
              helperText={errors.otp}
              disabled={loading}
              inputProps={{
                maxLength: 6,
                pattern: '[0-9]*'
              }}
            />
            <Box sx={{ mt: 1 }}>
              <Button
                onClick={() => handleRequestLoginOtp()}
                sx={{
                  'p': 0,
                  'color': '#006837',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                disabled={loading}
              >
                Gửi lại mã OTP
              </Button>
            </Box>
          </>
        )

      case 'forgotOtpVerify':
        return (
          <>
            <Typography variant='body2' sx={{ mb: 2, mt: 1 }}>
              Vui lòng nhập mã OTP đã gửi đến email và mật khẩu mới của bạn.
            </Typography>
            <TextField
              margin='normal'
              required
              fullWidth
              label='Mã OTP'
              name='otp'
              autoFocus
              value={formData.otp}
              onChange={handleInputChange}
              error={!!errors.otp}
              helperText={errors.otp}
              disabled={loading}
              inputProps={{
                maxLength: 6,
                pattern: '[0-9]*'
              }}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='newPassword'
              label='Mật khẩu mới'
              type={showNewPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleInputChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge='end' aria-label='toggle new password visibility' disabled={loading}>
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='confirmNewPassword'
              label='Xác nhận mật khẩu mới'
              type={showConfirmNewPassword ? 'text' : 'password'}
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} edge='end' aria-label='toggle confirm new password visibility' disabled={loading}>
                      {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Box sx={{ mt: 1 }}>
              <Button
                onClick={() => handleRequestForgotPasswordOtp()}
                sx={{
                  'p': 0,
                  'color': '#006837',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                disabled={loading}
              >
                Gửi lại mã OTP
              </Button>
            </Box>
          </>
        )

      default:
        return null
    }
  }

  const handleDialogClose = () => {
    if (!loading) {
      onClose()
    }
  }

  const renderFooterByType = () => {
    switch (formType) {
      case 'login':
        return (
          <>
            <Typography variant='body2' sx={{ mb: 1 }}>
              Chưa có tài khoản?{' '}
              <Button
                onClick={() => setFormType('signup')}
                sx={{
                  'p': 0,
                  'color': '#006837',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                disabled={loading}
              >
                Đăng ký ngay
              </Button>
            </Typography>
            <Button
              onClick={() => setFormType('forgot')}
              sx={{
                'p': 0,
                'color': '#006837',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              disabled={loading}
            >
              Quên mật khẩu?
            </Button>
          </>
        )
      case 'signup':
        return (
          <Typography variant='body2' sx={{ mb: 1 }}>
            Đã có tài khoản?{' '}
            <Button
              onClick={() => setFormType('login')}
              sx={{
                'p': 0,
                'color': '#006837',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              disabled={loading}
            >
              Đăng nhập
            </Button>
          </Typography>
        )
      case 'forgot':
      case 'forgotOtpRequest':
      case 'forgotOtpVerify':
        return (
          <Button
            onClick={() => setFormType('login')}
            sx={{
              'p': 0,
              'color': '#006837',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
            disabled={loading}
          >
            Quay lại đăng nhập
          </Button>
        )
      case 'loginOtpRequest':
      case 'loginOtpVerify':
        return (
          <Button
            onClick={() => setFormType('login')}
            sx={{
              'p': 0,
              'color': '#006837',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
            disabled={loading}
          >
            Quay lại đăng nhập
          </Button>
        )
      default:
        return null
    }
  }

  const getButtonText = () => {
    switch (formType) {
      case 'login':
        return 'Đăng nhập'
      case 'signup':
        return 'Đăng ký'
      case 'forgot':
      case 'forgotOtpRequest':
        return 'Gửi mã OTP'
      case 'loginOtpRequest':
        return 'Gửi mã OTP'
      case 'loginOtpVerify':
        return 'Xác nhận OTP'
      case 'forgotOtpVerify':
        return 'Đặt lại mật khẩu'
      default:
        return 'Xác nhận'
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose} maxWidth='xs' fullWidth disableScrollLock={true}>
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              width: '100%'
            }}
          >
            <Typography variant='h6' component='span'>
              {getTitle()}
            </Typography>
            <IconButton
              onClick={handleDialogClose}
              size='small'
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
              disabled={loading}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {apiError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {renderFormByType()}

            <Button
              type='submit'
              fullWidth
              variant='contained'
              disabled={loading}
              sx={{
                'mt': 3,
                'mb': 2,
                'backgroundColor': '#006837',
                '&:hover': {
                  backgroundColor: '#005a2f'
                },
                'position': 'relative'
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : getButtonText()}
            </Button>

            <Box sx={{ textAlign: 'center' }}>{renderFooterByType()}</Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant='filled' sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
