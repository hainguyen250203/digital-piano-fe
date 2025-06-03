'use client'

import { OrderStatus, ResponseOrder } from '@/types/order.type'
import { getOrderStep, getPaymentStatusColor, getPaymentStatusText, getStatusColor, getStatusIcon, getStatusText, getStepIcon } from '@/utils/order'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import { Avatar, Box, Chip, Paper, Stack, Typography, styled } from '@mui/material'
import React, { useMemo } from 'react'

// Compact mobile step connector
const StepConnector = styled(Box)<{ completed?: boolean }>(({ theme, completed }) => ({
  height: 2,
  flex: 1,
  backgroundColor: completed ? theme.palette.primary.main : theme.palette.grey[300],
  transition: 'all 0.3s ease'
}))

interface OrderHeaderProps {
  orderData: ResponseOrder
  isMobile: boolean
}

export default function OrderHeader({ orderData, isMobile }: OrderHeaderProps) {
  // Memoize active step to prevent recalculation
  const activeStep = useMemo(() => getOrderStep(orderData?.orderStatus), [orderData?.orderStatus])

  // Order steps for the stepper
  const steps = ['Đã đặt hàng', 'Đang xử lý', 'Đang giao hàng', 'Đã giao hàng']
  // Short labels for mobile
  const shortSteps = ['Đặt hàng', 'Xử lý', 'Vận chuyển', 'Giao hàng']

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant='h6' fontWeight={600} gutterBottom>
            Đơn hàng #{orderData.id}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Ngày đặt: {new Date(orderData.createdAt).toLocaleDateString('vi-VN')} {new Date(orderData.createdAt).toLocaleTimeString('vi-VN')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, sm: 0 }, flexWrap: 'wrap' }}>
          <Chip icon={getStatusIcon(orderData.orderStatus)} label={getStatusText(orderData.orderStatus)} color={getStatusColor(orderData.orderStatus)} />
          <Chip label={getPaymentStatusText(orderData.paymentStatus)} color={getPaymentStatusColor(orderData.paymentStatus)} />
        </Box>
      </Box>

      {activeStep >= 0 && (
        <Box sx={{ width: '100%', mt: 2 }}>
          {isMobile ? (
            <Box>
              {/* Compact step indicators with dots and connecting lines */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 1 }}>
                {steps.map((_, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <StepConnector completed={index <= activeStep} />
                    )}
                    <Box sx={{ position: 'relative' }}>
                      {index <= activeStep ? (
                        <Avatar
                          sx={{
                            width: 16,
                            height: 16,
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontSize: '0.6rem',
                          }}
                        >
                          {index < activeStep ? <CheckIcon sx={{ fontSize: 12 }} /> : index + 1}
                        </Avatar>
                      ) : (
                        <Avatar
                          sx={{
                            width: 16,
                            height: 16,
                            bgcolor: 'grey.300',
                            color: 'text.secondary',
                            fontSize: '0.6rem',
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      )}
                    </Box>
                  </React.Fragment>
                ))}
              </Box>
              
              {/* Step labels below the indicators */}
              <Stack 
                direction="row" 
                justifyContent="space-between" 
                sx={{ 
                  mt: 1,
                  px: 0.5,
                  '& > div': { 
                    width: '25%', 
                    textAlign: 'center',
                    px: 0.5
                  } 
                }}
              >
                {shortSteps.map((label, index) => (
                  <Box key={index}>
                    <Typography
                      variant="caption"
                      fontSize="0.65rem"
                      fontWeight={index === activeStep ? 600 : 400}
                      color={index <= activeStep ? 'primary.main' : 'text.secondary'}
                      sx={{ 
                        display: 'block', 
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 2 }}>
                {steps.map((label, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <StepConnector completed={index <= activeStep} />
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          bgcolor: index <= activeStep ? 'primary.main' : 'grey.300',
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                      >
                        {index < activeStep ? <CheckIcon /> : getStepIcon(index)}
                      </Avatar>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          mt: 0.5, 
                          textAlign: 'center',
                          maxWidth: '80px',
                          fontWeight: index === activeStep ? 600 : 400
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {orderData.orderStatus === OrderStatus.CANCELLED && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'error.50', borderRadius: 2, border: '1px dashed', borderColor: 'error.main' }}>
          <Typography variant='subtitle2' color='error' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CancelIcon fontSize='small' />
            Đơn hàng đã bị hủy
          </Typography>
        </Box>
      )}
    </Paper>
  )
} 