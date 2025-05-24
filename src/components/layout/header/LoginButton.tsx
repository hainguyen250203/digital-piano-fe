'use client'

import { Button, Typography } from '@mui/material'

interface LoginButtonProps {
  onClick: () => void
}

/**
 * Beautiful login button for non-authenticated users
 */
export default function LoginButton({ onClick }: LoginButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant='contained'
      size='medium'
      sx={{
        textTransform: 'none',
        fontWeight: 600
      }}
    >
      <Typography variant='body1' fontWeight={600}>
        Login
      </Typography>
    </Button>
  )
}
