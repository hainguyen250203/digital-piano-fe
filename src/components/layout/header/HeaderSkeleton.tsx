'use client'

import { AppBar, Box, Container, Skeleton, Toolbar, styled } from '@mui/material'
import { alpha } from '@mui/material/styles'

// Styled components
const SkeletonLogo = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  bgcolor: alpha(theme.palette.primary.main, 0.08),
  '&::after': {
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`
  }
}))

const SkeletonSearchBar = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  bgcolor: alpha(theme.palette.primary.main, 0.08),
  '&::after': {
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`
  }
}))

const SkeletonButton = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  bgcolor: alpha(theme.palette.primary.main, 0.08),
  '&::after': {
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`
  }
}))

const SkeletonIcon = styled(Skeleton)(({ theme }) => ({
  borderRadius: '50%',
  bgcolor: alpha(theme.palette.primary.main, 0.08),
  '&::after': {
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`
  }
}))

export default function HeaderSkeleton() {
  return (
    <AppBar position='sticky' elevation={0} sx={{ backgroundColor: '#f9f9f9', color: 'text.primary' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ py: 1, minHeight: { xs: '64px', sm: '70px' } }}>
          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none' }, mr: 1 }}>
            <SkeletonIcon variant="circular" width={40} height={40} animation="wave" />
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: {
                xs: 'auto 1fr auto', // mobile
                sm: 'auto 1fr auto auto', // tablet: menu | logo | search | actions
                md: '200px minmax(0, 1fr) auto' // desktop
              },
              alignItems: 'center',
              gap: { xs: 1, sm: 2 }
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}
            >
              <SkeletonLogo variant="rounded" width={150} height={50} animation="wave" />
            </Box>

            {/* Search Bar */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', width: '100%' }}>
              <SkeletonSearchBar variant="rounded" width="100%" height={48} animation="wave" />
            </Box>

            {/* User Controls */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                ml: { xs: 'auto', md: 0 },
                gap: 1
              }}
            >
              <SkeletonButton variant="rounded" width={100} height={40} animation="wave" />
              <SkeletonIcon variant="circular" width={40} height={40} animation="wave" />
              <SkeletonIcon variant="circular" width={40} height={40} animation="wave" />
            </Box>
          </Box>
        </Toolbar>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonButton
                key={index}
                variant="rounded"
                width={100}
                height={48}
                animation="wave"
              />
            ))}
          </Box>
        </Box>
      </Container>
    </AppBar>
  )
} 