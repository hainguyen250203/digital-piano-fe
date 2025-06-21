'use client'

import { ResProductReturn, ReturnStatus } from '@/types/return.interface'
import CancelIcon from '@mui/icons-material/Cancel'
import { Box, Button, Tooltip } from '@mui/material'

interface ReturnActionsProps {
  returnItem: ResProductReturn
  isCancelReturnLoading: boolean
  onCancelReturn: (returnId: string) => void
}

export default function ReturnActions({ returnItem, isCancelReturnLoading, onCancelReturn }: ReturnActionsProps) {
  // Check if return can be cancelled (only PENDING status)
  const canCancel = returnItem.status === ReturnStatus.PENDING

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {canCancel && (
        <Tooltip title='Hủy yêu cầu trả hàng'>
          <Button
            variant='outlined'
            size='small'
            color='error'
            startIcon={<CancelIcon />}
            onClick={() => onCancelReturn(returnItem.id)}
            disabled={isCancelReturnLoading}
            sx={{
              'minWidth': 'auto',
              'px': 1,
              'py': 0.5,
              'fontSize': '0.75rem',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'white'
              }
            }}
          >
            Hủy
          </Button>
        </Tooltip>
      )}
    </Box>
  )
}
