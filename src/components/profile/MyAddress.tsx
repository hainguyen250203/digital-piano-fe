'use client'

import AddressForm from '@/components/address/AddressForm'
import { useAddressActions } from '@/hooks/address/useAddressActions'
import { ResponseAddress } from '@/types/address.type'
import { BaseResponse } from '@/types/base-response'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import HomeIcon from '@mui/icons-material/Home'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useMemo } from 'react'

interface AddressSectionProps {
  addressData: BaseResponse<ResponseAddress[]> | undefined
  addressRefetch: () => void
}

export default function AddressSection({ addressData, addressRefetch }: AddressSectionProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Use address actions hook
  const {
    openAddressDialog,
    currentAddress,
    page,
    rowsPerPage,
    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isSettingDefaultAddress,
    handleOpenAddressDialog,
    handleCloseAddressDialog,
    handleSaveAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
    handleChangePage,
    handleChangeRowsPerPage
  } = useAddressActions({
    onAddressChanged: addressRefetch
  })

  // Memoize addresses data
  const addresses = useMemo(() => addressData?.data || [], [addressData])

  // Get paginated addresses for desktop/tablet, all addresses for mobile
  const displayAddresses = useMemo(() => {
    if (isMobile) return addresses
    return addresses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [addresses, isMobile, page, rowsPerPage])

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HomeIcon />
            <Typography variant='h6' component='h2'>
              Địa Chỉ Của Tôi
            </Typography>
          </Box>
          <Button
            variant='contained'
            color='secondary'
            startIcon={<AddIcon />}
            onClick={() => handleOpenAddressDialog()}
            sx={{
              'bgcolor': 'white',
              'color': 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
            size='small'
          >
            Thêm Địa Chỉ
          </Button>
        </Box>

        {addresses.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Alert
              severity='info'
              icon={<LocationOnIcon />}
              sx={{
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                py: 2
              }}
            >
              <Typography variant='body1'>Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ để thuận tiện cho việc đặt hàng.</Typography>
            </Alert>
          </Box>
        ) : isMobile ? (
          // Mobile View with Cards
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {displayAddresses.map((address: ResponseAddress) => (
                <Box key={address.id}>
                  <Card
                    sx={{
                      bgcolor: address.isDefault ? 'primary.50' : 'white',
                      position: 'relative'
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant='subtitle1' fontWeight='bold'>
                          {address.fullName}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {address.phone}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant='body2' sx={{ mb: 0.5 }}>
                          {address.street}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {address.ward}, {address.district}, {address.city}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 2
                        }}
                      >
                        {address.isDefault ? (
                          <Typography
                            variant='body2'
                            color='success.main'
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              fontWeight: 'medium'
                            }}
                          >
                            <CheckCircleIcon fontSize='small' />
                            Mặc định
                          </Typography>
                        ) : (
                          <Button size='small' variant='outlined' color='primary' onClick={() => handleSetDefaultAddress(address.id)} disabled={isSettingDefaultAddress}>
                            Đặt làm mặc định
                          </Button>
                        )}

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title='Chỉnh sửa'>
                            <IconButton size='small' color='primary' onClick={() => handleOpenAddressDialog(address)}>
                              <EditIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                          {!address.isDefault && (
                            <Tooltip title='Xóa'>
                              <IconButton size='small' color='error' onClick={() => handleDeleteAddress(address.id)} disabled={isDeletingAddress}>
                                <DeleteIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          // Desktop/Tablet View with Table
          <>
            <TableContainer
              sx={{
                'maxWidth': '100%',
                'overflowX': 'auto',
                '& .MuiTable-root': {
                  minWidth: 650
                }
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant='subtitle2' fontWeight={600}>
                        Họ tên
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='subtitle2' fontWeight={600}>
                        Địa chỉ
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='subtitle2' fontWeight={600}>
                        Điện thoại
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='subtitle2' fontWeight={600}>
                        Trạng thái
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='subtitle2' fontWeight={600}>
                        Thao tác
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayAddresses.map((address: ResponseAddress) => (
                    <TableRow
                      key={address.id}
                      hover
                      sx={{
                        bgcolor: address.isDefault ? 'primary.50' : 'transparent'
                      }}
                    >
                      <TableCell>
                        <Typography variant='body1'>{address.fullName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                            minWidth: 300
                          }}
                        >
                          <Typography
                            variant='body2'
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {address.street}
                          </Typography>
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {address.ward}, {address.district}, {address.city}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body1'>{address.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        {address.isDefault ? (
                          <Typography
                            variant='body2'
                            color='success.main'
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              fontWeight: 'medium'
                            }}
                          >
                            <CheckCircleIcon fontSize='small' />
                            Mặc định
                          </Typography>
                        ) : (
                          <Button size='small' variant='outlined' color='primary' onClick={() => handleSetDefaultAddress(address.id)} disabled={isSettingDefaultAddress}>
                            Đặt làm mặc định
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title='Chỉnh sửa'>
                            <IconButton size='small' color='primary' onClick={() => handleOpenAddressDialog(address)}>
                              <EditIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                          {!address.isDefault && (
                            <Tooltip title='Xóa'>
                              <IconButton size='small' color='error' onClick={() => handleDeleteAddress(address.id)} disabled={isDeletingAddress}>
                                <DeleteIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[3, 5, 10]}
              component='div'
              count={addresses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage='Số địa chỉ trên trang:'
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
            />
          </>
        )}
      </Paper>

      <AddressForm
        open={openAddressDialog}
        onClose={handleCloseAddressDialog}
        onSubmit={handleSaveAddress}
        initialData={currentAddress || undefined}
        isSubmitting={isCreatingAddress || isUpdatingAddress}
        title={currentAddress ? 'Chỉnh Sửa Địa Chỉ' : 'Thêm Địa Chỉ Mới'}
      />
    </>
  )
}
