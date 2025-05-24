'use client'

import CloseIcon from '@mui/icons-material/Close'
import { Box, Drawer, IconButton, Typography, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'

interface SideDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  icon: ReactNode
  iconColor?: string
  footer?: ReactNode
  children: ReactNode
  count?: number
}

/**
 * Unified side drawer component for consistent UI across the application
 */
const SideDrawer: React.FC<SideDrawerProps> = ({ 
  open, 
  onClose, 
  title, 
  icon, 
  iconColor,
  footer, 
  children,
  count
}) => {
  const theme = useTheme()

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      variant='temporary'
      elevation={4}
      sx={{
        'zIndex': theme => theme.zIndex.modal,
        '& .MuiDrawer-paper': {
          width: {
            xs: '100%',
            sm: '80%',
            md: '50%',
            lg: '35%'
          },
          boxSizing: 'border-box',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderLeft: '1px solid #e0e0e0',
          marginTop: 0,
          height: '100%',
          backgroundColor: '#ffffff',
          color: '#000000'
        }
      }}
      ModalProps={{
        BackdropProps: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }
        }
      }}
      transitionDuration={300}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: '#ffffff'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <Box sx={{ color: iconColor || theme.palette.primary.main, mr: 1.5, display: 'flex' }}>
            {icon}
          </Box>
          <Typography variant='h6' fontWeight={600}>
            {title} {count !== undefined && `(${count})`}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{
              'position': 'absolute',
              'right': { xs: 8, sm: 16 },
              'color': '#666666',
              '&:hover': {
                color: '#000000',
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </Box>

        {/* Footer - optional */}
        {footer && (
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#ffffff'
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </Drawer>
  )
}

export default SideDrawer 