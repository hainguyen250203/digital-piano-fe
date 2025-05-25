'use client'

import { UserData } from '@/hooks/apis/user'
import { Role } from '@/services/apis/user'
import { BaseResponse } from '@/types/base-response'
import BadgeIcon from '@mui/icons-material/Badge'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import SaveIcon from '@mui/icons-material/Save'
import { Avatar, Box, Button, Card, CardContent, Divider, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

interface ProfileInformationProps {
  profileData: BaseResponse<UserData>
  onUpdateProfile: (data: { phoneNumber: string | undefined }) => void
  onUpdateAvatar: (formData: FormData) => void
  isUpdatingProfile: boolean
  isUpdatingAvatar: boolean
}

export default function ProfileInformation({ profileData, onUpdateProfile, onUpdateAvatar, isUpdatingProfile, isUpdatingAvatar }: ProfileInformationProps) {
  // Profile state
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined)
  const [isEditing, setIsEditing] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const wasUpdating = React.useRef(false)

  // Profile effects and handlers
  React.useEffect(() => {
    if (profileData?.data) {
      setPhoneNumber(profileData.data.phoneNumber || undefined)
    }
  }, [profileData])

  // Exit edit mode when updates are complete
  React.useEffect(() => {
    // If we were updating and now updates are complete
    if (wasUpdating.current && !isUpdatingProfile && !isUpdatingAvatar) {
      setIsEditing(false)
      wasUpdating.current = false
    }

    // Track if we're updating
    if (isUpdatingProfile || isUpdatingAvatar) {
      wasUpdating.current = true
    }
  }, [isUpdatingProfile, isUpdatingAvatar])

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (profileData?.data) {
      setPhoneNumber(profileData.data.phoneNumber || undefined)
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

    // Track if any updates were initiated
    let updatesInitiated = false

    // Only call onUpdateProfile if the phone number has changed and is not empty string or undefined
    const hasValidPhoneNumber = phoneNumber !== undefined && phoneNumber !== '' && phoneNumber !== null
    const phoneNumberChanged = profileData?.data && phoneNumber !== profileData.data.phoneNumber

    if (hasValidPhoneNumber && phoneNumberChanged) {
      onUpdateProfile({ phoneNumber })
      updatesInitiated = true
    }

    // Always process avatar update if a new file is selected, regardless of phone number
    if (avatarFile) {
      const formData = new FormData()
      formData.append('file', avatarFile)
      onUpdateAvatar(formData)
      updatesInitiated = true
    }

    // If no updates were initiated, just exit edit mode
    if (!updatesInitiated) {
      setIsEditing(false)
    }
  }

  if (!profileData?.data) {
    return null
  }

  const { email, role, avatarUrl } = profileData.data

  return (
    <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonIcon />
        <Typography variant='h6' component='h2' fontWeight={600}>
          Thông Tin Cá Nhân
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Avatar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={previewUrl || avatarUrl}
                alt='Ảnh đại diện'
                sx={{ width: 120, height: 120, mb: 2, border: '4px solid', borderColor: 'primary.light', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
              />
              {isEditing && (
                <Button
                  variant='contained'
                  component='label'
                  size='small'
                  color='primary'
                  sx={{ position: 'absolute', bottom: 10, right: -10, minWidth: 'auto', width: 36, height: 36, borderRadius: '50%' }}
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
                <Button type='submit' variant='contained' color='primary' disabled={isUpdatingProfile || isUpdatingAvatar} size='medium' startIcon={<SaveIcon />}>
                  {isUpdatingProfile || isUpdatingAvatar ? 'Đang Lưu...' : 'Lưu'}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
