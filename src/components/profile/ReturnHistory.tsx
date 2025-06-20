'use client'

import ReturnTable from '@/components/profile/ReturnTable'
import { useFetchGetUserProductReturns } from '@/hooks/apis/product-return'
import { Alert, Box, Paper, TablePagination, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import { ReturnHistoryHeader } from './OrderHistoryHeader'
import { ReturnStatusFilter } from './OrderStatusFilter'

export default function ReturnHistory() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data: returnData, isError } = useFetchGetUserProductReturns()

  const returns = useMemo(() => returnData?.data || [], [returnData])

  // Filter returns by status
  const filteredReturns = useMemo(() => {
    if (statusFilter === 'all') return returns
    return returns.filter(r => r.status === statusFilter)
  }, [returns, statusFilter])

  // Paginate
  const displayReturns = useMemo(() => {
    if (isMobile) return filteredReturns
    return filteredReturns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [filteredReturns, isMobile, page, rowsPerPage])

  if (isError) {
    return (
      <Alert severity='error'>
        <Typography variant='body1'>Không thể tải lịch sử trả hàng. Vui lòng thử lại.</Typography>
      </Alert>
    )
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <ReturnHistoryHeader />
        <ReturnStatusFilter statusFilter={statusFilter} onStatusFilterChange={e => setStatusFilter(e.target.value)} />

        {filteredReturns.length === 0 ? (
          <Box p={3}>
            <Alert severity='info' sx={{ borderRadius: 2 }}>
              <Typography variant='body1'>Không tìm thấy yêu cầu trả hàng nào{statusFilter !== 'all' ? ' với trạng thái đã chọn' : ''}.</Typography>
            </Alert>
          </Box>
        ) : (
          <>
            <ReturnTable returns={displayReturns} />
            {!isMobile && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={filteredReturns.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={e => {
                  setRowsPerPage(parseInt(e.target.value, 10))
                  setPage(0)
                }}
                labelRowsPerPage='Yêu cầu mỗi trang:'
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
              />
            )}
          </>
        )}
      </Paper>
    </>
  )
}
