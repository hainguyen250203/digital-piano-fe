import { CreateAddressPayload, ResponseAddress } from '@/types/address.type'
import { Box, Button, Card, CardContent, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, Select, Typography } from '@mui/material'
import AddressForm from './AddressForm'

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
                    <Box sx={{ 
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5
                    }}>
                      <Typography variant='body1' fontWeight={500}>
                        {address.fullName}
                      </Typography>
                      <Typography 
                        variant='body2' 
                        color='text.secondary'
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          wordBreak: 'break-word'
                        }}
                      >
                        {address.street}, {address.ward}, {address.district}, {address.city}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Điện thoại: {address.phone}
                      </Typography>
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
          <Box sx={{ mt: 1 }}>
            <AddressForm 
              addressForm={addressForm}
              onAddressChange={onAddressChange}
            />
            <Box sx={{ mt: 2 }}>
              <FormControlLabel 
                control={<Radio checked={addressForm.isDefault} onChange={onToggleDefault} />} 
                label='Đặt làm địa chỉ mặc định' 
              />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
} 