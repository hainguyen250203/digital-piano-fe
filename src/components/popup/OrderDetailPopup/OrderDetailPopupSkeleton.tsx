'use client'

import { Box, Divider, Paper, Skeleton, Stack, useMediaQuery, useTheme } from '@mui/material'

export default function OrderDetailPopupSkeleton() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header & Status Skeleton */}
      <Paper 
        elevation={0} 
        sx={{ p: { xs: 2, sm: 2.5 }, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width={isMobile ? "60%" : 180} height={32} />
          <Skeleton variant="rounded" width={isMobile ? "30%" : 100} height={24} />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
          <Skeleton variant="text" width={isMobile ? "80%" : 150} height={24} />
          {!isMobile && <Skeleton variant="text" width={120} height={24} />}
          {isMobile && <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />}
        </Stack>
      </Paper>

      {/* Address Skeleton */}
      <Paper 
        elevation={0}
        sx={{ p: { xs: 2, sm: 2.5 }, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      >
        <Skeleton variant="text" width={isMobile ? "50%" : 140} height={28} />
        <Box sx={{ mt: 1 }}>
          <Skeleton variant="text" width="90%" height={24} />
          <Skeleton variant="text" width="70%" height={24} />
          <Skeleton variant="text" width="50%" height={24} />
        </Box>
      </Paper>

      {/* Payment Skeleton */}
      <Paper 
        elevation={0}
        sx={{ p: { xs: 2, sm: 2.5 }, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      >
        <Skeleton variant="text" width={isMobile ? "55%" : 160} height={28} />
        <Stack spacing={1} sx={{ mt: 1 }}>
          <Skeleton variant="text" width="85%" height={24} />
          <Skeleton variant="text" width="65%" height={24} />
        </Stack>
      </Paper>

      {/* Order Items Skeleton */}
      <Paper 
        elevation={0}
        sx={{ p: { xs: 2, sm: 2.5 }, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      >
        <Skeleton variant="text" width={isMobile ? "60%" : 160} height={28} />
        
        {/* Item 1 */}
        <Box sx={{ 
          mt: 2, 
          display: 'flex', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' }
        }}>
          <Skeleton 
            variant="rectangular" 
            width={isMobile ? "100%" : 80} 
            height={isMobile ? 120 : 80} 
            sx={{ 
              borderRadius: 1, 
              flexShrink: 0,
              maxWidth: { xs: '100%', sm: 80 }
            }} 
          />
          <Box sx={{ flex: 1, width: isMobile ? '100%' : 'auto', mt: isMobile ? 1 : 0 }}>
            <Skeleton variant="text" width="80%" height={24} />
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0.5, sm: 2 },
              mt: 0.5,
              mb: 1
            }}>
              <Skeleton variant="text" width={isMobile ? "40%" : "30%"} height={20} />
              <Skeleton variant="text" width={isMobile ? "50%" : "40%"} height={20} />
            </Box>
            <Skeleton variant="text" width={isMobile ? "55%" : "30%"} height={22} />
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        
        {/* Item 2 */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' }
        }}>
          <Skeleton 
            variant="rectangular" 
            width={isMobile ? "100%" : 80} 
            height={isMobile ? 120 : 80} 
            sx={{ 
              borderRadius: 1, 
              flexShrink: 0,
              maxWidth: { xs: '100%', sm: 80 }
            }} 
          />
          <Box sx={{ flex: 1, width: isMobile ? '100%' : 'auto', mt: isMobile ? 1 : 0 }}>
            <Skeleton variant="text" width="70%" height={24} />
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 0.5, sm: 2 },
              mt: 0.5,
              mb: 1
            }}>
              <Skeleton variant="text" width={isMobile ? "45%" : "35%"} height={20} />
              <Skeleton variant="text" width={isMobile ? "55%" : "45%"} height={20} />
            </Box>
            <Skeleton variant="text" width={isMobile ? "60%" : "25%"} height={22} />
          </Box>
        </Box>

        {/* Mobile review button placeholder */}
        {isMobile && (
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="rounded" width={120} height={32} />
          </Box>
        )}
      </Paper>

      {/* Order Summary Skeleton */}
      <Paper 
        elevation={0}
        sx={{ p: { xs: 2, sm: 2.5 }, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      >
        <Skeleton variant="text" width={isMobile ? "50%" : 140} height={28} />
        <Stack spacing={1.5} sx={{ mt: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width={isMobile ? "40%" : 120} height={20} />
            <Skeleton variant="text" width={isMobile ? "25%" : 80} height={20} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width={isMobile ? "35%" : 100} height={20} />
            <Skeleton variant="text" width={isMobile ? "20%" : 70} height={20} />
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width={isMobile ? "30%" : 80} height={24} />
            <Skeleton variant="text" width={isMobile ? "25%" : 90} height={24} />
          </Box>
        </Stack>
      </Paper>

      {/* Action Button Skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Skeleton variant="rounded" width={120} height={36} />
      </Box>
    </Box>
  )
} 