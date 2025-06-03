import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import { Box, Typography } from '@mui/material'

export default function OrderHistoryHeader() {
  return (
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
        <ShoppingBagIcon />
        <Typography variant='h6' component='h2'>
          Đơn Hàng Của Tôi
        </Typography>
      </Box>
    </Box>
  )
} 