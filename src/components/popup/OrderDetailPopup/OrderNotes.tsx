'use client'

import { Paper, Typography } from '@mui/material'
import { memo } from 'react'

interface OrderNotesProps {
  note: string
}

// Use React.memo to prevent unnecessary re-renders
export default memo(function OrderNotes({ note }: OrderNotesProps) {
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
      <Typography variant='subtitle1' fontWeight={600} gutterBottom>
        Ghi Chú
      </Typography>
      <Typography variant='body2'>{note}</Typography>
    </Paper>
  )
}) 