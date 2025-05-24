'use client'

import InvoiceList from '@/components/admin/invoice/invoice-list'
import { Box } from '@mui/material'
export default function InvoicesPage() {
  return (
    <Box height='100vh' width='100%'>
      <InvoiceList />
    </Box>
  )
}
