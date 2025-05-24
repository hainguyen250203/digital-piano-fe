'use client'

import { Role, UserData, useFetchUpdateRole } from '@/hooks/apis/user'
import { QueryKey } from '@/models/QueryKey'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import CloseIcon from '@mui/icons-material/Close'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import PersonIcon from '@mui/icons-material/Person'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Paper,
  Typography,
  Zoom,
  alpha
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'

export interface UpdateUserRoleModalProps {
  open: boolean
  onClose: () => void
  user: UserData
}

interface RoleOption {
  value: Role
  label: string
  icon: React.ReactNode
  description: string
  color: string
}

const roleOptions: RoleOption[] = [
  {
    value: Role.ADMIN,
    label: 'Quản trị viên',
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />,
    description: 'Quyền truy cập đầy đủ vào tất cả tính năng, bao gồm quản lý người dùng.',
    color: '#2196f3'
  },
  {
    value: Role.STAFF,
    label: 'Nhân viên',
    icon: <SupportAgentIcon sx={{ fontSize: 32 }} />,
    description: 'Truy cập vào hầu hết các tính năng ngoại trừ quản lý người dùng.',
    color: '#4caf50'
  },
  {
    value: Role.CUSTOMER,
    label: 'Khách hàng',
    icon: <PersonIcon sx={{ fontSize: 32 }} />,
    description: 'Người dùng thông thường với quyền truy cập hạn chế vào bảng quản trị.',
    color: '#ff9800'
  }
]

export default function UpdateUserRoleModal({ open, onClose, user }: UpdateUserRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(user.role)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { mutate: updateRole, isPending } = useFetchUpdateRole({
    onSuccess: () => {
      toast.success('Cập nhật vai trò người dùng thành công!')
      queryClient.invalidateQueries({ queryKey: [QueryKey.USER_LIST] })
      onClose()
    },
    onError: error => {
      toast.error(error.message || 'Cập nhật vai trò người dùng thất bại')
    }
  })

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    setError(null)
  }

  const handleSubmit = () => {
    if (!selectedRole) {
      setError('Vui lòng chọn một vai trò')
      return
    }

    if (selectedRole === user.role) {
      onClose()
      return
    }

    updateRole({ 
      id: user.id, 
      data: { role: selectedRole } 
    })
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      TransitionComponent={Zoom}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ManageAccountsIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Cập nhật vai trò người dùng
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
            Thông tin người dùng
          </Typography>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2.5,
              bgcolor: theme => alpha(theme.palette.primary.main, 0.04),
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 500
                }}
              >
                {user.email.charAt(0).toUpperCase()}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
                  {user.email}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                  Vai trò hiện tại: <span style={{ fontWeight: 500, color: roleOptions.find(r => r.value === user.role)?.color }}>{
                    user.role === Role.ADMIN ? 'Quản trị viên' : 
                    user.role === Role.STAFF ? 'Nhân viên' : 'Khách hàng'
                  }</span>
                </Typography>
              </Box>
            </Box>
            {user.phoneNumber && (
              <Typography variant="body2" color="text.secondary">
                📱 {user.phoneNumber}
              </Typography>
            )}
          </Paper>
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
          Chọn vai trò mới
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {roleOptions.map((role) => (
            <Paper
              key={role.value}
              onClick={() => handleRoleSelect(role.value)}
              sx={{
                p: 2,
                cursor: 'pointer',
                border: '2px solid',
                borderColor: selectedRole === role.value ? role.color : 'transparent',
                bgcolor: selectedRole === role.value ? alpha(role.color, 0.04) : 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                  bgcolor: alpha(role.color, 0.04)
                }
              }}
            >
              <Box sx={{ color: role.color, mb: 1 }}>
                {role.icon}
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                {role.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ minHeight: 60 }}>
                {role.description}
              </Typography>
            </Paper>
          ))}
        </Box>
        
        {error && (
          <FormHelperText error sx={{ mt: 2 }}>
            {error}
          </FormHelperText>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: 'background.default' }}>
        <Button 
          onClick={onClose} 
          disabled={isPending}
          sx={{ 
            minWidth: 100,
            '&:hover': {
              bgcolor: 'error.lighter'
            }
          }}
        >
          Hủy
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isPending || selectedRole === user.role}
          sx={{ 
            minWidth: 100,
            position: 'relative'
          }}
        >
          {isPending ? (
            <>
              <CircularProgress size={24} sx={{ color: 'inherit', position: 'absolute', left: '50%', top: '50%', marginLeft: '-12px', marginTop: '-12px' }} />
              <span style={{ visibility: 'hidden' }}>Cập nhật</span>
            </>
          ) : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
} 