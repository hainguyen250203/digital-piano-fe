'use client'

import ViewProfileModal from '@/components/admin/header/view-profile-modal'
import { useAuthStore } from '@/context/AuthStoreContext'
import { useFetchCurrentUserProfile } from '@/hooks/apis/profile'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function UserProfileMenu() {
  const { clearAuth } = useAuthStore(state => state)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const open = Boolean(anchorEl)
  const { data: profileData } = useFetchCurrentUserProfile()
  const router = useRouter()
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    clearAuth()
    router.push('/admin/login')
  }

  const handleProfile = () => {
    handleClose()
    setProfileModalOpen(true)
  }

  return (
    <Box>
      <Tooltip title='Tài khoản'>
        <IconButton onClick={handleClick} size='small' sx={{ ml: 2 }} aria-controls={open ? 'account-menu' : undefined} aria-haspopup='true' aria-expanded={open ? 'true' : undefined}>
          {profileData?.data?.avatarUrl ? (
            <Avatar src={profileData.data.avatarUrl} sx={{ width: 32, height: 32, bgcolor: 'primary.main' }} />
          ) : (
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              <PersonIcon fontSize='small' />
            </Avatar>
          )}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            'overflow': 'visible',
            'filter': 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            'mt': 1.5,
            'width': 200,
            '& .MuiMenuItem-root': {
              fontSize: '0.9rem',
              py: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonIcon fontSize='small' />
          </ListItemIcon>
          Hồ sơ
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize='small' color='error' />
          </ListItemIcon>
          <Typography color='error'>Đăng xuất</Typography>
        </MenuItem>
      </Menu>

      {/* Profile Modal */}
      <ViewProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </Box>
  )
}
