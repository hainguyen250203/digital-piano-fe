'use client'

import { useFetchCurrentUserProfile, useFetchUpdateAvatar, useFetchUpdateProfile } from '@/hooks/apis/profile'
import { Role } from '@/services/apis/user'
import BadgeIcon from '@mui/icons-material/Badge'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import SaveIcon from '@mui/icons-material/Save'
import { Alert, Avatar, Box, Button, Card, CardContent, CircularProgress, Divider, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

export default function ProfileInformation() {
  // Profile state and hooks
  const { data: profileData, isLoading: profileLoading, error: profileError, refetch: profileRefetch } = useFetchCurrentUserProfile()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Mutations
  const updateProfileMutation = useFetchUpdateProfile({
    onSuccess: () => {
      profileRefetch()
      setIsEditing(false)
    }
  })

  const updateAvatarMutation = useFetchUpdateAvatar({
    onSuccess: () => {
      profileRefetch()
    }
  })

  // Profile effects and handlers
  React.useEffect(() => {
    if (profileData?.data) {
      setPhoneNumber(profileData.data.phoneNumber || '')
    }
  }, [profileData])

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (profileData?.data) {
      setPhoneNumber(profileData.data.phoneNumber || '')
    }
    setAvatarFile(null)
    setPreviewUrl(null)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setAvatarFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate({ phoneNumber })

    if (avatarFile) {
      const formData = new FormData()
      formData.append('avatar', avatarFile)
      updateAvatarMutation.mutate(formData)
    }
  }

  if (profileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (profileError || !profileData) {
    return <Alert severity='error'>Không thể tải thông tin cá nhân. Vui lòng thử lại.</Alert>
  }

  const { email, avatarUrl, role } = profileData.data || {}

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}
    >
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <PersonIcon />
        <Typography variant='h6' component='h2' fontWeight={600}>
          Thông Tin Cá Nhân
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          {/* Avatar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={previewUrl || avatarUrl}
                alt='Ảnh đại diện'
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  border: '4px solid',
                  borderColor: 'primary.light',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              />
              {isEditing && (
                <Button
                  variant='contained'
                  component='label'
                  size='small'
                  color='primary'
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: -10,
                    minWidth: 'auto',
                    width: 36,
                    height: 36,
                    borderRadius: '50%'
                  }}
                >
                  <CameraAltIcon fontSize='small' />
                  <input type='file' hidden accept='image/*' onChange={handleAvatarChange} />
                </Button>
              )}
            </Box>
          </Box>

          <Divider />

          {/* Form Fields */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <EmailIcon color='primary' sx={{ mt: 1 }} />
            <TextField fullWidth label='Email' value={email} disabled variant='outlined' size='small' />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <PhoneIcon color='primary' sx={{ mt: 1 }} />
            <TextField
              fullWidth
              label='Số Điện Thoại'
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              disabled={!isEditing}
              variant='outlined'
              size='small'
              placeholder='Nhập số điện thoại của bạn'
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <BadgeIcon color='primary' sx={{ mt: 1 }} />
            <TextField fullWidth label='Vai Trò' value={role === Role.CUSTOMER ? 'Người Dùng' : role === Role.ADMIN ? 'Quản Trị Viên' : role} disabled variant='outlined' size='small' />
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, gap: 2 }}>
            {!isEditing ? (
              <Button variant='contained' color='primary' onClick={handleStartEdit} fullWidth size='medium' startIcon={<EditIcon />}>
                Chỉnh Sửa Thông Tin
              </Button>
            ) : (
              <>
                <Button variant='outlined' onClick={handleCancelEdit} size='medium' startIcon={<CancelIcon />}>
                  Hủy
                </Button>
                <Button type='submit' variant='contained' color='primary' disabled={updateProfileMutation.isPending || updateAvatarMutation.isPending} size='medium' startIcon={<SaveIcon />}>
                  {updateProfileMutation.isPending || updateAvatarMutation.isPending ? 'Đang Lưu...' : 'Lưu'}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
