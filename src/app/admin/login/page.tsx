'use client'

import { useFetchLogin } from '@/hooks/apis/auth'
import { clearAuthCookies, hasAdminAccess, isAuthenticated, setAuthCookies } from '@/utils/auth'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Alert, Box, Button, CircularProgress, Container, Divider, Fade, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Admin login page component
 * Handles authentication for admin users
 */
export default function AdminLoginPage() {
  const router = useRouter()

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [formTouched, setFormTouched] = useState(false)
  const [error, setError] = useState<{ message: string } | null>(null)

  // Check if already logged in and redirect
  useEffect(() => {
    if (isAuthenticated() && hasAdminAccess()) {
      router.push('/admin')
    } else if (isAuthenticated()) {
      // If logged in but not admin, clear auth and show message
      clearAuthCookies()
      setError({ message: 'Bạn không có quyền truy cập vào trang quản trị' })
    }
  }, [router])

  // Use login mutation from hooks
  const { mutate: login, isPending: loading } = useFetchLogin({
    onSuccess: data => {
      const role = data.data?.role?.toUpperCase()

      // Only allow admin and staff roles
      if (role === 'ADMIN' || role === 'STAFF') {
        // Set auth cookies
        setAuthCookies(data.data?.accessToken || '', role)

        // Wait a moment for cookies to be set before redirecting
        setTimeout(() => {
          router.push('/admin')
        }, 100)
      } else {
        setError({ message: 'Bạn không có quyền truy cập vào trang quản trị' })
      }
    },
    onError: err => {
      setError({ message: err.message || 'Đăng nhập thất bại' })
    }
  })

  // Clear errors when user types
  useEffect(() => {
    if (formTouched) {
      setError(null)
      setValidationErrors({})
    }
  }, [email, password, formTouched])

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Email validation
    if (!email) {
      errors.email = 'Email không được để trống'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email không hợp lệ'
    }

    // Password validation
    if (!password) {
      errors.password = 'Mật khẩu không được để trống'
    } else if (password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormTouched(true)

    if (!validateForm()) {
      return
    }

    login({ email, password })
  }

  /**
   * Toggle password visibility
   */
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <Box sx={{ height: '100vh', bgcolor: '#ffffff', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth='sm'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Paper
            elevation={2}
            sx={{
              padding: 4,
              borderRadius: 2,
              width: '100%',
              bgcolor: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Box
                sx={{
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  borderRadius: '50%',
                  p: 1,
                  mb: 2
                }}
              >
                <LockOutlinedIcon />
              </Box>
              <Typography component='h1' variant='h5' fontWeight='500' color='primary.main'>
                Đăng nhập Quản trị Viên
              </Typography>
            </Box>

            {error && (
              <Fade in={!!error}>
                <Alert severity='error' sx={{ mb: 3 }}>
                  {error.message}
                </Alert>
              </Fade>
            )}

            <Box component='form' onSubmit={handleSubmit} noValidate>
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Địa chỉ Email'
                name='email'
                autoComplete='email'
                autoFocus
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  setFormTouched(true)
                }}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Mật khẩu'
                type={showPassword ? 'text' : 'password'}
                id='password'
                autoComplete='current-password'
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setFormTouched(true)
                }}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton aria-label='toggle password visibility' onClick={toggleShowPassword} edge='end'>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                disabled={loading}
                sx={{
                  py: 1.5,
                  mt: 1,
                  mb: 2,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
              </Button>

              <Divider sx={{ my: 2 }} />

              <Typography variant='body2' color='text.secondary' align='center' sx={{ mt: 2 }}>
                Khu vực quản trị chỉ dành cho người được cấp quyền
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}
