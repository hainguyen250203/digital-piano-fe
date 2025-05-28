import { Box, CircularProgress, Typography } from '@mui/material'
import { ReactNode, memo } from 'react'

interface LoadingWrapperProps {
  isLoading: boolean
  isEmpty?: boolean
  emptyMessage?: string
  height?: number | string
  children: ReactNode
}

const LoadingWrapper = memo(({
  isLoading,
  isEmpty = false,
  emptyMessage = 'Không có dữ liệu',
  height = 300,
  children
}: LoadingWrapperProps) => {
  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height={height}>
        <CircularProgress />
      </Box>
    )
  }

  if (isEmpty) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height={height}>
        <Typography>{emptyMessage}</Typography>
      </Box>
    )
  }

  return <>{children}</>
})

LoadingWrapper.displayName = 'LoadingWrapper'

export default LoadingWrapper 