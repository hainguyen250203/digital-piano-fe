'use client'

import { useFetchAddressList, useFetchCreateAddress, useFetchDeleteAddress, useFetchSetDefaultAddress, useFetchUpdateAddress } from '@/hooks/apis/address'
import { CreateAddressPayload, ResponseAddress, UpdateAddressPayload } from '@/types/address.type'
import AddIcon from '@mui/icons-material/Add'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import HomeIcon from '@mui/icons-material/Home'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SaveIcon from '@mui/icons-material/Save'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import React, { useMemo, useState } from 'react'

export default function AddressSection() {
  // Address state and hooks
  const { data: addressData, isLoading: addressLoading, refetch: addressRefetch } = useFetchAddressList()
  const [openAddressDialog, setOpenAddressDialog] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<ResponseAddress | null>(null)
  const [addressFormData, setAddressFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  })
  
  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(3)

  // Address mutations
  const { mutate: createAddress, isPending: isCreatingAddress } = useFetchCreateAddress({
    onSuccess: () => {
      addressRefetch()
      handleCloseAddressDialog()
    },
    onError: error => {
      console.error(error.message, 'lỗi khi tạo địa chỉ mới')
    }
  })

  const { mutate: updateAddress, isPending: isUpdatingAddress } = useFetchUpdateAddress({
    onSuccess: () => {
      addressRefetch()
      handleCloseAddressDialog()
    },
    onError: error => {
      console.error(error.message, 'lỗi khi cập nhật địa chỉ')
    }
  })

  const { mutate: deleteAddress, isPending: isDeletingAddress } = useFetchDeleteAddress({
    onSuccess: () => {
      addressRefetch()
    },
    onError: error => {
      console.error(error.message, 'lỗi khi xóa địa chỉ')
    }
  })

  const { mutate: setDefaultAddress, isPending: isSettingDefaultAddress } = useFetchSetDefaultAddress({
    onSuccess: () => {
      addressRefetch()
    },
    onError: error => {
      console.error(error.message, 'lỗi khi đặt địa chỉ mặc định')
    }
  })

  // Address handlers
  const handleOpenAddressDialog = (address: ResponseAddress | null = null) => {
    setCurrentAddress(address)
    if (address) {
      setAddressFormData({
        fullName: address.fullName || '',
        phone: address.phone || '',
        street: address.street || '',
        ward: address.ward || '',
        district: address.district || '',
        city: address.city || '',
        isDefault: address.isDefault || false
      })
    } else {
      setAddressFormData({
        fullName: '',
        phone: '',
        street: '',
        ward: '',
        district: '',
        city: '',
        isDefault: false
      })
    }
    setOpenAddressDialog(true)
  }

  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false)
    setCurrentAddress(null)
  }

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddressFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentAddress) {
      updateAddress({
        id: currentAddress.id,
        ...addressFormData
      } as UpdateAddressPayload)
    } else {
      createAddress(addressFormData as CreateAddressPayload)
    }
  }

  const handleDeleteAddress = (id: string) => {
    deleteAddress(id)
  }

  const handleSetDefaultAddress = (id: string) => {
    setDefaultAddress(id)
  }
  
  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Get addresses array safely
  const addresses = useMemo(() => addressData?.data || [], [addressData])

  if (addressLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

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
            <Typography variant='h6' component='h2' fontWeight={600}>
              Địa Chỉ Của Tôi
            </Typography>
          </Box>
          <Button
            variant='contained'
            color='secondary'
            startIcon={<AddIcon />}
            onClick={() => handleOpenAddressDialog()}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
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
              Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ để thuận tiện cho việc đặt hàng.
            </Alert>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Họ tên</TableCell>
                    <TableCell>Địa chỉ</TableCell>
                    <TableCell>Điện thoại</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addresses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((address: ResponseAddress) => (
                      <TableRow key={address.id} hover sx={{ 
                        bgcolor: address.isDefault ? 'primary.50' : 'transparent'
                      }}>
                        <TableCell>{address.fullName}</TableCell>
                        <TableCell sx={{ maxWidth: 250, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          {address.street}, {address.ward}, {address.district}, {address.city}
                        </TableCell>
                        <TableCell>{address.phone}</TableCell>
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
                            <Button 
                              size='small' 
                              variant='outlined' 
                              color='primary'
                              onClick={() => handleSetDefaultAddress(address.id)}
                              disabled={isSettingDefaultAddress}
                            >
                              Đặt làm mặc định
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title='Chỉnh sửa'>
                              <IconButton 
                                size='small' 
                                color='primary' 
                                onClick={() => handleOpenAddressDialog(address)}
                              >
                                <EditIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                            {!address.isDefault && (
                              <Tooltip title='Xóa'>
                                <IconButton 
                                  size='small' 
                                  color='error' 
                                  onClick={() => handleDeleteAddress(address.id)}
                                  disabled={isDeletingAddress}
                                >
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

      {/* Address Dialog */}
      <Dialog open={openAddressDialog} onClose={handleCloseAddressDialog} maxWidth='sm' fullWidth>
        <DialogTitle>
          {currentAddress ? 'Chỉnh Sửa Địa Chỉ' : 'Thêm Địa Chỉ Mới'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSaveAddress}>
            <Box sx={{ mt: 2, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <TextField
                label='Họ và tên'
                name='fullName'
                fullWidth
                required
                value={addressFormData.fullName}
                onChange={handleAddressInputChange}
              />
              <TextField
                label='Số điện thoại'
                name='phone'
                fullWidth
                required
                value={addressFormData.phone}
                onChange={handleAddressInputChange}
              />
              <TextField
                label='Địa chỉ'
                name='street'
                fullWidth
                required
                value={addressFormData.street}
                onChange={handleAddressInputChange}
                sx={{ gridColumn: '1 / -1' }}
              />
              <TextField
                label='Phường/Xã'
                name='ward'
                fullWidth
                required
                value={addressFormData.ward}
                onChange={handleAddressInputChange}
              />
              <TextField
                label='Quận/Huyện'
                name='district'
                fullWidth
                required
                value={addressFormData.district}
                onChange={handleAddressInputChange}
              />
              <TextField
                label='Tỉnh/Thành phố'
                name='city'
                fullWidth
                required
                value={addressFormData.city}
                onChange={handleAddressInputChange}
                sx={{ gridColumn: '1 / -1' }}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant='outlined'
            color='inherit'
            onClick={handleCloseAddressDialog}
            startIcon={<CancelIcon />}
          >
            Hủy
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSaveAddress}
            disabled={isCreatingAddress || isUpdatingAddress}
            startIcon={<SaveIcon />}
          >
            {currentAddress ? 'Cập Nhật' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
