'use client'

import { useDeleteAllNotifications, useDeleteOneNotification, useFetchGetNotificationsUser, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from '@/hooks/apis/notification'
import { useNotification } from '@/hooks/useNotification'
import { NotificationType } from '@/types/notification.type'
import { getAccessToken } from '@/utils/auth'
import DeleteIcon from '@mui/icons-material/Delete'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import { Avatar, Badge, Box, Button, Chip, Divider, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Menu, Tooltip, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import React, { useState } from 'react'

// Icons for different notification types
import InfoIcon from '@mui/icons-material/Info'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { toast } from 'react-toastify'

export default function NotificationMenu() {
  const theme = useTheme()
  const token = getAccessToken() || null
  const { isConnected } = useNotification(token)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  // Fetch notifications
  const { data: notificationsData, isLoading, refetch: refetchNotifications } = useFetchGetNotificationsUser()
  const notificationList = notificationsData?.data || []
  const unreadCount = notificationList.filter(notification => !notification.isRead).length
  const hasNewNotifications = unreadCount > 0

  // Mutations
  const { mutate: markAsRead } = useMarkNotificationAsRead()
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead()
  const { mutate: deleteAllRead, isPending: isDeleting } = useDeleteAllNotifications({
    onSuccess: () => {
      toast.success('Đã xóa tất cả thông báo đã đọc')
      refetchNotifications()
    },
    onError: () => {
      toast.error('Không thể xóa thông báo')
    }
  })
  const { mutate: deleteOne } = useDeleteOneNotification({
    onSuccess: () => {
      toast.success('Đã xóa thông báo')
      refetchNotifications()
    },
    onError: () => {
      toast.error('Không thể xóa thông báo')
      
    }
  })

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId)
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const handleDeleteAllRead = () => {
    deleteAllRead()
  }

  const handleDeleteNotification = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation()
    deleteOne(notificationId)
  }

  // Function to get icon based on notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER:
        return <ShoppingCartIcon />
      case NotificationType.PROMOTION:
        return <LocalOfferIcon />
      case NotificationType.REVIEW:
        return <RateReviewIcon />
      case NotificationType.SYSTEM:
      default:
        return <InfoIcon />
    }
  }

  // Function to get color based on notification type
  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER:
        return theme.palette.primary.main
      case NotificationType.PROMOTION:
        return theme.palette.secondary.main
      case NotificationType.REVIEW:
        return theme.palette.info.main
      case NotificationType.SYSTEM:
      default:
        return theme.palette.grey[500]
    }
  }

  const getNotificationLabel = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER:
        return 'Đơn hàng'
      case NotificationType.PROMOTION:
        return 'Khuyến mãi'
      case NotificationType.REVIEW:
        return 'Đánh giá'
      case NotificationType.SYSTEM:
      default:
        return 'Hệ thống'
    }
  }

  return (
    <>
      <Tooltip title={isConnected ? 'Thông báo' : 'Thông báo (Đang ngắt kết nối)'}>
        <IconButton onClick={handleClick} color='inherit' aria-controls={open ? 'notification-menu' : undefined} aria-haspopup='true' aria-expanded={open ? 'true' : undefined}>
          <Badge
            badgeContent={unreadCount}
            color={hasNewNotifications ? 'warning' : 'error'}
            showZero={false}
            overlap='circular'
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: isConnected ? undefined : theme.palette.text.disabled
              }
            }}
          >
            {!isConnected ? <NotificationsOffIcon color='disabled' /> : hasNewNotifications ? <NotificationsActiveIcon sx={{ color: theme.palette.warning.main }} /> : <NotificationsIcon />}
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        id='notification-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: { xs: '80vw', sm: 360 },
            maxHeight: { xs: '70vh', sm: 480 },
            overflowY: 'auto',
            borderRadius: 2,
            mt: 1
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))'
            }
          }
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.palette.background.paper,
            position: 'sticky',
            top: 0,
            zIndex: 1,
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon fontSize='small' sx={{ verticalAlign: 'middle' }} />
            Thông báo
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {unreadCount > 0 && (
              <Tooltip title='Đánh dấu tất cả đã đọc'>
                <Button size='small' variant='text' color='primary' startIcon={<DoneAllIcon />} onClick={handleMarkAllAsRead} sx={{ minWidth: 'unset' }}>
                  Đọc tất cả
                </Button>
              </Tooltip>
            )}
            {notificationList.some(notification => notification.isRead) && (
              <Tooltip title='Xóa tất cả thông báo đã đọc'>
                <IconButton size='small' color='error' onClick={handleDeleteAllRead} disabled={isDeleting}>
                  <DeleteSweepIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        <Divider />

        {isLoading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color='text.secondary'>Đang tải thông báo...</Typography>
          </Box>
        ) : !notificationList.length ? (
          <Box sx={{ py: 6, px: 2, textAlign: 'center' }}>
            <Avatar sx={{ width: 50, height: 50, mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.background.paper, 0.8) }}>
              <NotificationsOffIcon sx={{ color: theme.palette.text.disabled }} />
            </Avatar>
            <Typography color='text.secondary' variant='body1' sx={{ mb: 1 }}>
              Không có thông báo
            </Typography>
            <Typography color='text.disabled' variant='body2'>
              Bạn sẽ nhận được thông báo khi có cập nhật mới
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }} disablePadding>
            {notificationList.map(notification => (
              <Box key={notification.id}>
                <ListItemButton
                  alignItems='flex-start'
                  divider
                  dense
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                  sx={{
                    'py': 1.5,
                    'px': 2,
                    'backgroundColor': notification.isRead ? 'inherit' : alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12)
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: alpha(getNotificationColor(notification.type), 0.1),
                        color: getNotificationColor(notification.type)
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                        <Typography
                          variant='subtitle2'
                          sx={{
                            fontWeight: notification.isRead ? 500 : 700,
                            color: theme.palette.text.primary,
                            flexGrow: 1,
                            pr: 1
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Chip
                          label={getNotificationLabel(notification.type)}
                          size='small'
                          variant='outlined'
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            color: getNotificationColor(notification.type),
                            borderColor: getNotificationColor(notification.type)
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          variant='body2'
                          component='span'
                          color='text.secondary'
                          sx={{
                            display: 'block',
                            fontSize: '0.875rem'
                          }}
                        >
                          {notification.content}
                        </Typography>
                        <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant='caption' color='text.disabled' sx={{ fontSize: '0.75rem' }}>
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: vi
                            })}
                            {!notification.isRead && (
                              <Tooltip title='Chưa đọc'>
                                <Box
                                  component='span'
                                  sx={{
                                    display: 'inline-block',
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: theme.palette.primary.main,
                                    ml: 1,
                                    verticalAlign: 'middle'
                                  }}
                                />
                              </Tooltip>
                            )}
                          </Typography>
                          <Tooltip title='Xóa thông báo'>
                            <IconButton
                              size='small'
                              color='error'
                              onClick={e => handleDeleteNotification(e, notification.id)}
                              sx={{
                                'opacity': 0.7,
                                '&:hover': { opacity: 1 }
                              }}
                            >
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </>
                    }
                  />
                </ListItemButton>
              </Box>
            ))}
          </List>
        )}
      </Menu>
    </>
  )
}
