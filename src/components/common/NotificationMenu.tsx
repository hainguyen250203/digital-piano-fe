'use client'

import { useFetchGetNotificationsUser, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from '@/hooks/apis/notification'
import { useNotification } from '@/hooks/useNotification'
import { NotificationType } from '@/types/notification.type'
import { getAccessToken } from '@/utils/auth'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  Fade,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import React, { useEffect, useState } from 'react'

// Icons for different notification types
import InfoIcon from '@mui/icons-material/Info'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

export default function NotificationMenu() {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [token, setToken] = useState<string | null>(null)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)

  const { data: notifications, refetch, isLoading } = useFetchGetNotificationsUser()
  const { mutate: markAsRead } = useMarkNotificationAsRead()
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead()

  // Get token on component mount
  useEffect(() => {
    const accessToken = getAccessToken()
    if (accessToken) {
      setToken(accessToken)
    }
  }, [])

  // Use the real-time notification hook
  const { isConnected } = useNotification(token)

  // Set up polling to fetch notifications every minute as a fallback
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 60000) // Poll every 60 seconds

    return () => clearInterval(interval)
  }, [refetch])

  // Listen for new notifications via query cache updates
  useEffect(() => {
    if (notifications?.data && notifications.data.length > 0) {
      const hasUnread = notifications.data.some(notification => !notification.isRead)
      if (hasUnread) {
        setHasNewNotifications(true)
      }
    }
  }, [notifications])

  const unreadCount = notifications?.data?.filter(notification => !notification.isRead).length || 0
  const notificationList = notifications?.data || []

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    // Reset the new notifications indicator when menu is opened
    setHasNewNotifications(false)
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
        <IconButton
          onClick={handleClick}
          color='inherit'
          aria-controls={open ? 'notification-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          sx={{
            position: 'relative',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.1)'
            },
            ...(hasNewNotifications && {
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                borderRadius: '50%',
                animation: 'pulse 1.5s infinite',
              },
              '@keyframes pulse': {
                '0%': { boxShadow: '0 0 0 0 rgba(255, 82, 82, 0.4)' },
                '70%': { boxShadow: '0 0 0 10px rgba(255, 82, 82, 0)' },
                '100%': { boxShadow: '0 0 0 0 rgba(255, 82, 82, 0)' }
              }
            })
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color={hasNewNotifications ? 'warning' : 'error'}
            showZero={false}
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: isConnected ? undefined : theme.palette.text.disabled
              }
            }}
          >
            {!isConnected ? (
              <NotificationsOffIcon color="disabled" />
            ) : hasNewNotifications ? (
              <NotificationsActiveIcon 
                sx={{ 
                  color: theme.palette.warning.main,
                  animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
                  '@keyframes shake': {
                    '0%, 100%': { transform: 'rotate(0)' },
                    '20%, 60%': { transform: 'rotate(8deg)' },
                    '40%, 80%': { transform: 'rotate(-8deg)' }
                  }
                }} 
              />
            ) : (
              <NotificationsIcon />
            )}
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
        TransitionComponent={Fade}
        transitionDuration={200}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.default,
          position: 'sticky',
          top: 0,
          zIndex: 1,
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          <Typography variant='h6' sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon fontSize="small" sx={{ verticalAlign: 'middle' }} /> 
            Thông báo
          </Typography>
          {unreadCount > 0 && (
            <Tooltip title="Đánh dấu tất cả đã đọc">
              <Button 
                size='small' 
                variant="text"
                color="primary"
                startIcon={<DoneAllIcon />} 
                onClick={handleMarkAllAsRead}
                sx={{ minWidth: 'unset' }}
              >
                Đọc tất cả
              </Button>
            </Tooltip>
          )}
        </Box>
        <Divider />

        {isLoading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color='text.secondary'>Đang tải thông báo...</Typography>
          </Box>
        ) : !notificationList.length ? (
          <Box sx={{ py: 8, px: 2, textAlign: 'center' }}>
            <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: theme.palette.background.paper }}>
              <NotificationsOffIcon fontSize="large" sx={{ color: theme.palette.text.disabled }} />
            </Avatar>
            <Typography color='text.secondary' variant="body1" sx={{ mb: 1 }}>
              Không có thông báo
            </Typography>
            <Typography color='text.disabled' variant="body2">
              Bạn sẽ nhận được thông báo khi có cập nhật mới
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }} disablePadding>
            {notificationList.map(notification => (
              <Fade key={notification.id} in={true} timeout={300}>
                <Box>
                  <ListItemButton
                    alignItems='flex-start'
                    divider
                    dense
                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      backgroundColor: notification.isRead ? 'inherit' : alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
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
                            variant="subtitle2" 
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
                            size="small"
                            variant="outlined"
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
                          <Typography 
                            variant='caption' 
                            display='block' 
                            color='text.disabled' 
                            sx={{ mt: 0.5, fontSize: '0.75rem' }}
                          >
                            {formatDistanceToNow(new Date(notification.createdAt), { 
                              addSuffix: true,
                              locale: vi 
                            })}
                            {!notification.isRead && (
                              <Tooltip title="Chưa đọc">
                                <Box 
                                  component="span" 
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
                        </>
                      }
                    />
                  </ListItemButton>
                </Box>
              </Fade>
            ))}
          </List>
        )}
      </Menu>
    </>
  )
}
