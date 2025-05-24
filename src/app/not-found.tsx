'use client'

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        gap: 2,
        px: 2,
        bgcolor: 'white'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 1
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography
          variant='h1'
          component='h1'
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            color: 'primary.main',
            letterSpacing: '-0.02em'
          }}
        >
          404
        </Typography>
      </Box>

      <Typography
        variant='h5'
        component='h2'
        sx={{
          mb: 1,
          color: 'text.primary',
          fontWeight: 500
        }}
      >
        Page Not Found
      </Typography>

      <Typography
        variant='body1'
        sx={{
          mb: 3,
          color: 'text.secondary',
          maxWidth: '400px',
          fontSize: '0.95rem',
          lineHeight: 1.6
        }}
      >
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>

      <Button
        variant='contained'
        size='medium'
        onClick={() => router.push('/')}
        sx={{
          px: 3,
          py: 1,
          borderRadius: 1.5,
          textTransform: 'none',
          fontSize: '0.95rem',
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }
        }}
      >
        Return to Home
      </Button>
    </Box>
  )
}
