import { CreateAddressPayload, UpdateAddressPayload } from '@/types/address.type'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveIcon from '@mui/icons-material/Save'
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import { useEffect, useState } from 'react'
import { getDistricts, getProvinces, getWards } from 'vietnam-provinces'

interface Province {
  code: string
  name: string
  name_en: string
  full_name: string
  full_name_en: string
  code_name: string
  administrative_unit_id: number
  administrative_region_id: number
}

interface District {
  code: string
  name: string
  name_en: string
  full_name: string
  full_name_en: string
  code_name: string
  province_code: string
  administrative_unit_id: number
}

interface Ward {
  code: string
  name: string
  name_en: string
  full_name: string
  full_name_en: string
  code_name: string
  district_code: string
  administrative_unit_id: number
}

interface AddressFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateAddressPayload | UpdateAddressPayload) => void
  initialData?: {
    fullName: string
    phone: string
    street: string
    ward: string
    district: string
    city: string
    isDefault: boolean
  }
  isSubmitting?: boolean
  title?: string
}

export default function AddressForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
  title = 'Thêm Địa Chỉ Mới'
}: AddressFormProps) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  })

  // Loading states
  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingWards, setLoadingWards] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      // TODO: Set selected province and district based on initial data
    }
  }, [initialData])

  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true)
      try {
        const provincesList = getProvinces()
        setProvinces(provincesList)
      } catch (error) {
        console.error('Error loading provinces:', error)
      } finally {
        setLoadingProvinces(false)
      }
    }
    
    loadProvinces()
  }, [])

  useEffect(() => {
    const loadDistricts = async () => {
      if (!selectedProvince) {
        setDistricts([])
        setSelectedDistrict(null)
        setWards([])
        setSelectedWard(null)
        return
      }
      
      setLoadingDistricts(true)
      try {
        const districtsList = getDistricts(selectedProvince.code)
        setDistricts(districtsList)
        setSelectedDistrict(null)
        setWards([])
        setSelectedWard(null)
      } catch (error) {
        console.error('Error loading districts:', error)
      } finally {
        setLoadingDistricts(false)
      }
    }
    
    loadDistricts()
  }, [selectedProvince])

  useEffect(() => {
    const loadWards = async () => {
      if (!selectedDistrict) {
        setWards([])
        setSelectedWard(null)
        return
      }
      
      setLoadingWards(true)
      try {
        const wardsList = getWards(selectedDistrict.code)
        setWards(wardsList)
        setSelectedWard(null)
      } catch (error) {
        console.error('Error loading wards:', error)
      } finally {
        setLoadingWards(false)
      }
    }
    
    loadWards()
  }, [selectedDistrict])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProvinceChange = (_event: React.SyntheticEvent, newValue: Province | null) => {
    setSelectedProvince(newValue)
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        city: newValue.name
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        city: ''
      }))
    }
  }

  const handleDistrictChange = (_event: React.SyntheticEvent, newValue: District | null) => {
    setSelectedDistrict(newValue)
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        district: newValue.name
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        district: ''
      }))
    }
  }

  const handleWardChange = (_event: React.SyntheticEvent, newValue: Ward | null) => {
    setSelectedWard(newValue)
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        ward: newValue.name
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        ward: ''
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <TextField
              label='Họ và tên'
              name='fullName'
              fullWidth
              required
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <TextField
              label='Số điện thoại'
              name='phone'
              fullWidth
              required
              value={formData.phone}
              onChange={handleInputChange}
            />
            <TextField
              label='Địa chỉ'
              name='street'
              fullWidth
              required
              value={formData.street}
              onChange={handleInputChange}
              sx={{ gridColumn: '1 / -1' }}
            />
            
            <Autocomplete
              options={provinces}
              loading={loadingProvinces}
              value={selectedProvince}
              onChange={handleProvinceChange}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Tỉnh/Thành phố" 
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingProvinces ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              noOptionsText="Không tìm thấy tỉnh/thành phố"
              fullWidth
            />
            
            <Autocomplete
              options={districts}
              loading={loadingDistricts}
              value={selectedDistrict}
              onChange={handleDistrictChange}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Quận/Huyện" 
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingDistricts ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              noOptionsText="Không tìm thấy quận/huyện"
              disabled={!selectedProvince}
              fullWidth
            />
            
            <Autocomplete
              options={wards}
              loading={loadingWards}
              value={selectedWard}
              onChange={handleWardChange}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Phường/Xã" 
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingWards ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              noOptionsText="Không tìm thấy phường/xã"
              disabled={!selectedDistrict}
              fullWidth
              sx={{ gridColumn: '1 / -1' }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant='outlined'
            color='inherit'
            onClick={onClose}
            startIcon={<CancelIcon />}
          >
            Hủy
          </Button>
          <Button
            variant='contained'
            color='primary'
            type='submit'
            disabled={isSubmitting}
            startIcon={<SaveIcon />}
          >
            {initialData ? 'Cập Nhật' : 'Lưu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
} 