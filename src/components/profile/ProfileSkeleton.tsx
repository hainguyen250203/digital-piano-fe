import { Box, Card, CardContent, Divider, Skeleton } from '@mui/material'

export function ProfileInformationSkeleton() {
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
        <Skeleton variant="circular" width={24} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
        <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Box
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
            <Skeleton
              variant="circular"
              width={120}
              height={120}
              sx={{
                mb: 2,
                border: '4px solid',
                borderColor: 'primary.light'
              }}
            />
          </Box>

          <Divider />

          {/* Form Fields */}
          {[1, 2, 3].map((item) => (
            <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Skeleton variant="circular" width={24} height={24} sx={{ mt: 1 }} />
              <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
            </Box>
          ))}

          <Divider />

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Skeleton variant="rectangular" height={40} width="100%" sx={{ borderRadius: 1 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export function OrderHistorySkeleton() {
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
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="circular" width={24} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
          <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
        </Box>
      </Box>

      {/* Filters */}
      <Box p={2} display="flex" gap={2} flexWrap="wrap">
        <Box>
          <Skeleton variant="text" width={100} height={20} sx={{ mb: 0.5 }} />
          <Skeleton variant="rectangular" height={40} width={200} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>

      {/* Table */}
      <Box sx={{ px: 2, pb: 2 }}>
        {/* Table header */}
        <Box sx={{ display: 'flex', mb: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          {[15, 15, 15, 15, 15, 15, 10].map((width, i) => (
            <Skeleton key={i} variant="text" width={`${width}%`} height={24} sx={{ mr: 1 }} />
          ))}
        </Box>

        {/* Table rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <Box key={row} sx={{ display: 'flex', mb: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            {[15, 15, 15, 15, 15, 15, 10].map((width, i) => (
              <Box key={i} sx={{ width: `${width}%`, mr: 1 }}>
                {i === 2 || i === 3 ? (
                  <Skeleton variant="rectangular" width="80%" height={30} sx={{ borderRadius: 4 }} />
                ) : i === 6 ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="circular" width={30} height={30} />
                  </Box>
                ) : (
                  <Skeleton variant="text" width="90%" height={24} />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Skeleton variant="rectangular" width={300} height={40} sx={{ borderRadius: 1 }} />
      </Box>
    </Card>
  )
}

export function AddressSkeleton() {
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
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="circular" width={24} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
          <Skeleton variant="text" width={150} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
        </Box>
        <Skeleton variant="rectangular" width={120} height={36} sx={{ bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 1 }} />
      </Box>

      <CardContent>
        {[1, 2].map((item) => (
          <Box 
            key={item} 
            sx={{ 
              mb: 2, 
              p: 2, 
              borderRadius: 1, 
              border: '1px solid', 
              borderColor: 'divider' 
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" width={100} height={24} />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 1 }} />
              </Box>
            </Box>
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={24} />
          </Box>
        ))}
      </CardContent>
    </Card>
  )
} 