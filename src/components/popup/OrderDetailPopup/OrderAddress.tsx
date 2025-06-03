'use client'

import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Box, Paper, Typography } from '@mui/material'

interface Address {
  fullName: string
  phone: string
  street: string
  ward: string
  district: string
  city: string
}

interface OrderAddressProps {
  address: Address
}

export default function OrderAddress({ address }: OrderAddressProps) {
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
      <Typography variant='subtitle1' fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationOnIcon fontSize='small' color='primary' />
        Địa Chỉ Giao Hàng
      </Typography>

      <Box sx={{ ml: 4 }}>
        <Typography variant='body1' fontWeight={500}>
          {address.fullName}
        </Typography>
        <Typography variant='body2'>Số điện thoại: {address.phone}</Typography>
        <Typography variant='body2' color='text.secondary'>
          {address.street}, {address.ward}, {address.district}, {address.city}
        </Typography>
      </Box>
    </Paper>
  )
} 