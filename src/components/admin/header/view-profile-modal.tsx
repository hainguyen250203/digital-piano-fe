'use client'

import { useFetchCurrentUserProfile, useFetchUpdateAvatar, useFetchUpdateProfile } from '@/hooks/apis/profile'
import BadgeIcon from '@mui/icons-material/Badge'
import CancelIcon from '@mui/icons-material/Cancel'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import SaveIcon from '@mui/icons-material/Save'
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Zoom
} from '@mui/material'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'

interface ViewProfileModalProps {
  open: boolean
  onClose: () => void
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const ProfileField = ({
  icon,
  label,
  value,
  editable = false,
  isEditing = false,
  onEdit = () => {},
  editValue = '',
  onEditChange = () => {},
  onSave = () => {},
  onCancel = () => {},
  isSaving = false
}: {
  icon: React.ReactNode
  label: string
  value: string
  editable?: boolean
  isEditing?: boolean
  onEdit?: () => void
  editValue?: string
  onEditChange?: (value: string) => void
  onSave?: () => void
  onCancel?: () => void
  isSaving?: boolean
}) => (
  <Stack direction='row' spacing={2} alignItems='center' width='100%'>
    <Box color='primary.main' display='flex' alignItems='center'>
      {icon}
    </Box>
    <Stack spacing={0.5} width='100%'>
      <Typography variant='caption' color='text.secondary'>
        {label}
      </Typography>
      {isEditing ? (
        <Stack direction='row' spacing={1} alignItems='center' width='100%'>
          <TextField
            fullWidth
            size='small'
            value={editValue}
            onChange={e => onEditChange(e.target.value)}
            variant='outlined'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Stack direction='row' spacing={0.5}>
                    <IconButton onClick={onCancel} size='small' color='error' disabled={isSaving}>
                      <CancelIcon fontSize='small' />
                    </IconButton>
                    <IconButton edge='end' onClick={onSave} disabled={isSaving} size='small' color='primary'>
                      {isSaving ? <CircularProgress size={16} /> : <SaveIcon fontSize='small' />}
                    </IconButton>
                  </Stack>
                </InputAdornment>
              )
            }}
          />
        </Stack>
      ) : (
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Typography variant='body1' fontWeight={500}>
            {value}
          </Typography>
          {editable && (
            <Tooltip title='Chỉnh sửa' arrow>
              <IconButton size='small' onClick={onEdit}>
                <EditIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      )}
    </Stack>
  </Stack>
)

export default function ViewProfileModal({ open, onClose }: ViewProfileModalProps) {
  const theme = useTheme()
  const { data: profileData, isLoading, refetch } = useFetchCurrentUserProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [avatarHover, setAvatarHover] = useState(false)
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')

  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useFetchUpdateAvatar({
    onSuccess: () => {
      toast.success('Cập nhật ảnh đại diện thành công')
      setSelectedFile(null)
      setPreviewUrl(null)
      refetch()
    },
    onError: error => {
      toast.error(error.message || 'Cập nhật ảnh đại diện thất bại')
    }
  })

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useFetchUpdateProfile({
    onSuccess: () => {
      toast.success('Cập nhật số điện thoại thành công')
      setIsEditingPhone(false)
      refetch()
    },
    onError: error => {
      toast.error(error.message || 'Cập nhật số điện thoại thất bại')
    }
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)
      updateAvatar(formData)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleEditPhone = () => {
    if (profileData?.data?.phoneNumber) {
      setPhoneNumber(profileData.data.phoneNumber)
    }
    setIsEditingPhone(true)
  }

  const handleSavePhone = () => {
    updateProfile({ phoneNumber })
  }

  const handleCancelEditPhone = () => {
    setIsEditingPhone(false)
    setPhoneNumber('')
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{ elevation: 3 }}
      TransitionComponent={Zoom}
      transitionDuration={300}
      sx={{ '& .MuiDialog-paper': { borderRadius: 2, overflow: 'hidden' } }}
    >
      <Box bgcolor={alpha(theme.palette.primary.main, 0.9)} height={120} position='relative' display='flex' justifyContent='center'>
        <IconButton
          onClick={onClose}
          size='small'
          color='primary'
          sx={{
            'position': 'absolute',
            'top': 16,
            'right': 16,
            'bgcolor': 'white',
            '&:hover': { bgcolor: 'white', opacity: 0.9 }
          }}
        >
          <CloseIcon fontSize='small' />
        </IconButton>

        <Box position='absolute' bottom={-60} display='flex' justifyContent='center'>
          <Tooltip title='Nhấn để thay đổi ảnh đại diện' arrow placement='top'>
            <Box
              component={Paper}
              onClick={handleAvatarClick}
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
              position='relative'
              borderRadius='50%'
              padding={0.5}
              bgcolor='background.paper'
              width={120}
              height={120}
              elevation={3}
              sx={{
                'cursor': 'pointer',
                'transition': 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              {(isLoading || isUpdatingAvatar) && (
                <Box position='absolute' top={0} left={0} right={0} bottom={0} display='flex' alignItems='center' justifyContent='center' zIndex={2}>
                  <CircularProgress size={40} thickness={5} />
                </Box>
              )}

              <Avatar
                src={previewUrl || profileData?.data?.avatarUrl || ''}
                alt={profileData?.data?.email || 'Hồ sơ'}
                sx={{
                  width: '100%',
                  height: '100%',
                  opacity: isLoading || isUpdatingAvatar ? 0.5 : 1
                }}
              />

              <Box
                position='absolute'
                top={0}
                left={0}
                right={0}
                bottom={0}
                display='flex'
                alignItems='center'
                justifyContent='center'
                borderRadius='50%'
                bgcolor={alpha('#000', avatarHover ? 0.4 : 0)}
                sx={{
                  opacity: avatarHover ? 1 : 0,
                  transition: 'all 0.3s ease'
                }}
              >
                <PhotoCameraIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
            </Box>
          </Tooltip>
        </Box>
      </Box>

      <DialogContent sx={{ pt: 8, pb: 4, px: { xs: 2, sm: 3 } }}>
        {isLoading ? (
          <Box display='flex' justifyContent='center' pt={8} pb={4}>
            <CircularProgress />
          </Box>
        ) : profileData?.data ? (
          <Stack spacing={4}>
            <Typography variant='h5' fontWeight={600} align='center' color='text.primary' mb={3}>
              {profileData.data.email.split('@')[0]}
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                borderRadius: 2
              }}
            >
              <Stack spacing={2.5}>
                <ProfileField icon={<EmailIcon />} label='Địa chỉ Email' value={profileData.data.email} />

                <Divider />

                <ProfileField icon={<BadgeIcon />} label='Vai trò tài khoản' value={profileData.data.role} />

                {profileData.data.phoneNumber || isEditingPhone ? (
                  <>
                    <Divider />
                    <ProfileField
                      icon={<PhoneIcon />}
                      label='Số điện thoại'
                      value={profileData.data.phoneNumber || 'Chưa có số điện thoại'}
                      editable={true}
                      isEditing={isEditingPhone}
                      onEdit={handleEditPhone}
                      editValue={phoneNumber}
                      onEditChange={setPhoneNumber}
                      onSave={handleSavePhone}
                      onCancel={handleCancelEditPhone}
                      isSaving={isUpdatingProfile}
                    />
                  </>
                ) : (
                  <>
                    <Divider />
                    <Stack direction='row' justifyContent='center' pt={1}>
                      <Button startIcon={<PhoneIcon />} onClick={handleEditPhone} variant='outlined' size='small'>
                        Thêm số điện thoại
                      </Button>
                    </Stack>
                  </>
                )}
              </Stack>
            </Paper>

            {selectedFile && (
              <Card
                variant='outlined'
                sx={{
                  p: 2.5,
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                }}
              >
                <Stack spacing={2}>
                  <Typography variant='subtitle2' color='info.main'>
                    Đã chọn ảnh đại diện mới
                  </Typography>

                  <Stack direction='row' spacing={1.5} width='100%'>
                    <Button variant='contained' color='primary' onClick={handleUpload} disabled={isUpdatingAvatar} fullWidth sx={{ py: 1 }}>
                      {isUpdatingAvatar ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Lưu thay đổi'}
                    </Button>
                    <Button variant='outlined' color='error' onClick={handleCancel} disabled={isUpdatingAvatar} sx={{ minWidth: 100 }}>
                      Hủy
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            )}

            {!selectedFile && <VisuallyHiddenInput type='file' ref={fileInputRef} accept='image/*' onChange={handleFileChange} />}
          </Stack>
        ) : (
          <Box py={4} textAlign='center'>
            <Typography color='text.secondary'>Không có dữ liệu hồ sơ</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
