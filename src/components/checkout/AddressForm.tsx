import { CreateAddressPayload } from '@/types/address.type'
import { Autocomplete, CircularProgress, Grid, TextField } from '@mui/material'
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
  addressForm: CreateAddressPayload
  onAddressChange: (field: keyof CreateAddressPayload) => (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function AddressForm({ addressForm, onAddressChange }: AddressFormProps) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null)
  
  // Loading states
  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingWards, setLoadingWards] = useState(false)

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

  // Custom handlers to update both local state and parent form
  const handleProvinceChange = (_event: React.SyntheticEvent, newValue: Province | null) => {
    setSelectedProvince(newValue)
    if (newValue) {
      const event = {
        target: { value: newValue.name }
      } as React.ChangeEvent<HTMLInputElement>
      onAddressChange('city')(event)
    }
  }

  const handleDistrictChange = (_event: React.SyntheticEvent, newValue: District | null) => {
    setSelectedDistrict(newValue)
    if (newValue) {
      const event = {
        target: { value: newValue.name }
      } as React.ChangeEvent<HTMLInputElement>
      onAddressChange('district')(event)
    }
  }

  const handleWardChange = (_event: React.SyntheticEvent, newValue: Ward | null) => {
    setSelectedWard(newValue)
    if (newValue) {
      const event = {
        target: { value: newValue.name }
      } as React.ChangeEvent<HTMLInputElement>
      onAddressChange('ward')(event)
    }
  }

  return (
    <Grid container spacing={2}>
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
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
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
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
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
        />
      </Grid>
    </Grid>
  )
} 