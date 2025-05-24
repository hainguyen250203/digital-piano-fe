import { CreateAddressPayload, ResponseAddress } from '@/types/address.type'
import { Box, Button, Card, CardContent, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, Select, TextField, Typography } from '@mui/material'

interface AddressSectionProps {
  addresses: ResponseAddress[]
  selectedAddressId: string
  useNewAddress: boolean
  addressForm: CreateAddressPayload
  onAddressChange: (field: keyof CreateAddressPayload) => (e: React.ChangeEvent<HTMLInputElement>) => void
  onAddressSelection: (id: string) => void
  onToggleNewAddress: (value: boolean) => void
  onToggleDefault: () => void
}

export default function AddressSection({
  addresses,
  selectedAddressId,
  useNewAddress,
  addressForm,
  onAddressChange,
  onAddressSelection,
  onToggleNewAddress,
  onToggleDefault
}: AddressSectionProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Địa Chỉ Giao Hàng
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {addresses.length === 0 ? (
          <Box sx={{ mb: 2 }}>
            <Typography color='text.secondary' gutterBottom>
              Không tìm thấy địa chỉ đã lưu. Vui lòng thêm địa chỉ giao hàng mới.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id='address-select-label'>Chọn Địa Chỉ</InputLabel>
              <Select
                labelId='address-select-label'
                id='address-select'
                value={selectedAddressId}
                label='Chọn Địa Chỉ'
                onChange={e => onAddressSelection(e.target.value as string)}
                disabled={useNewAddress}
              >
                {addresses.map(address => (
                  <MenuItem key={address.id} value={address.id}>
                    <Box>
                      <Typography variant='body1'>{address.fullName}</Typography>
                      <Typography variant='body2'>
                        {address.street}, {address.ward}, {address.district}, {address.city}
                      </Typography>
                      <Typography variant='body2'>Điện thoại: {address.phone}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FormControlLabel 
            control={<Radio checked={useNewAddress} onChange={() => onToggleNewAddress(true)} />} 
            label='Sử dụng địa chỉ mới' 
          />
          {useNewAddress && addresses.length > 0 && (
            <Button size='small' onClick={() => onToggleNewAddress(false)} sx={{ ml: 2 }}>
              Quay lại địa chỉ đã lưu
            </Button>
          )}
        </Box>

        {useNewAddress && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label='Họ và tên' 
                variant='outlined' 
                required 
                value={addressForm.fullName} 
                onChange={onAddressChange('fullName')} 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label='Số điện thoại' 
                variant='outlined' 
                required 
                value={addressForm.phone} 
                onChange={onAddressChange('phone')} 
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                label='Địa chỉ' 
                variant='outlined' 
                required 
                value={addressForm.street} 
                onChange={onAddressChange('street')} 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField 
                fullWidth 
                label='Phường/Xã' 
                variant='outlined' 
                required 
                value={addressForm.ward} 
                onChange={onAddressChange('ward')} 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField 
                fullWidth 
                label='Quận/Huyện' 
                variant='outlined' 
                required 
                value={addressForm.district} 
                onChange={onAddressChange('district')} 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField 
                fullWidth 
                label='Tỉnh/Thành phố' 
                variant='outlined' 
                required 
                value={addressForm.city} 
                onChange={onAddressChange('city')} 
              />
            </Grid>
            <Grid size={12}>
              <FormControlLabel 
                control={<Radio checked={addressForm.isDefault} onChange={onToggleDefault} />} 
                label='Đặt làm địa chỉ mặc định' 
              />
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
} 