import { useAuthStore } from '@/context/AuthStoreContext'
import { setAuthCookies } from '@/utils/auth'
import { Dialog, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { ForgotPasswordForm } from './auth/ForgotPasswordForm'
import { LoginForm } from './auth/LoginForm'
import { OtpLoginForm } from './auth/OtpLoginForm'
import { SignupForm } from './auth/SignupForm'

interface LoginPopupProps {
  open: boolean
  onClose: () => void
}

type FormType = 'login' | 'signup' | 'otp' | 'forgotPassword'

export default function LoginPopup({ open, onClose }: LoginPopupProps) {
  const [formType, setFormType] = useState<FormType>('login')
  const setAccessToken = useAuthStore(state => state.setAccessToken)
  const setUserRole = useAuthStore(state => state.setUserRole)

  const handleAuthSuccess = (accessToken: string, role: string) => {
    setAuthCookies(accessToken, role)
    setAccessToken(accessToken)
    setUserRole(role)
    onClose()
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setFormType(newValue === 0 ? 'login' : 'signup')
  }

  const renderForm = () => {
    switch (formType) {
      case 'login':
        return <LoginForm onSuccess={handleAuthSuccess} onSwitchToOtp={() => setFormType('otp')} onSwitchToForgotPassword={() => setFormType('forgotPassword')} />
      case 'signup':
        return <SignupForm onSuccess={handleAuthSuccess} />
      case 'otp':
        return <OtpLoginForm onSuccess={handleAuthSuccess} onBackToLogin={() => setFormType('login')} />
      case 'forgotPassword':
        return <ForgotPasswordForm onBackToLogin={() => setFormType('login')} />
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        {formType === 'login' || formType === 'signup' ? (
          <Tabs value={formType === 'login' ? 0 : 1} onChange={handleTabChange} centered sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label='Đăng nhập' />
            <Tab label='Đăng ký' />
          </Tabs>
        ) : null}
      </DialogTitle>
      <DialogContent>{renderForm()}</DialogContent>
    </Dialog>
  )
}
