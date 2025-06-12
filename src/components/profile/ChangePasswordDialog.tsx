'use client'

import { useFetchChangePassword } from '@/hooks/apis/auth'
import { BaseResponse } from '@/types/base-response'
import CloseIcon from '@mui/icons-material/Close'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ChangePasswordDialogProps {
  open: boolean
  onClose: () => void
}

export default function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
  const router = useRouter()
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { mutate: changePassword, isPending } = useFetchChangePassword({
    onSuccess: () => {
      // Clear form and show success message
      setOldPassword('')
      setNewPassword('')
      setError(null)
      // Close dialog and refresh
      onClose()
      router.refresh()
    },
    onError: (error: BaseResponse<null>) => {
      setError(error.message || 'Có lỗi xảy ra khi đổi mật khẩu')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!oldPassword || !newPassword) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    changePassword({
      oldPassword,
      newPassword
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockIcon />
          Đổi Mật Khẩu
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            'color': 'white',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label='Mật Khẩu Hiện Tại'
            type={showOldPassword ? 'text' : 'password'}
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            variant='outlined'
            size='small'
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <LockIcon color='primary' />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge='end'>
                    {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label='Mật Khẩu Mới'
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            variant='outlined'
            size='small'
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <LockIcon color='primary' />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge='end'>
                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button type='submit' variant='contained' color='primary' disabled={isPending} fullWidth sx={{ mt: 2 }}>
            {isPending ? 'Đang Xử Lý...' : 'Đổi Mật Khẩu'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
