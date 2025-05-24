import { Close as CloseIcon, RestartAlt as RestartAltIcon } from '@mui/icons-material'
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, IconButton, MenuItem, Select, Slider, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'

interface ProductFilterModalProps {
  open: boolean
  onClose: () => void
  onApply: (filters: { sortBy: string; priceRange: [number, number] }) => void
}

const DEFAULT_FILTERS = {
  sortBy: 'newest',
  priceRange: [0, 100000000] as [number, number]
}

const formatPrice = (value: number) => {
  return `${value.toLocaleString('vi-VN')} VND`
}

const ProductFilterModal = ({ open, onClose, onApply }: ProductFilterModalProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [sortBy, setSortBy] = useState(DEFAULT_FILTERS.sortBy)
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_FILTERS.priceRange)

  const handlePriceRangeChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number])
  }

  const handleReset = () => {
    setSortBy(DEFAULT_FILTERS.sortBy)
    setPriceRange(DEFAULT_FILTERS.priceRange)
  }

  const handleApply = () => {
    onApply({
      sortBy,
      priceRange
    })
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          px: { xs: 2, sm: 3 }
        }}
      >
        <Box component='span' sx={{ fontWeight: 'bold' }}>
          Bộ Lọc Sản Phẩm
        </Box>
        <IconButton onClick={onClose} size='small'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ 
        overflow: 'hidden',
        px: { xs: 2, sm: 3 },
        pb: { xs: 2, sm: 3 }
      }}>
        <Stack spacing={4} sx={{ mt: 2 }}>
          <Box>
            <Typography variant='subtitle1' fontWeight='medium' gutterBottom>
              Sắp xếp theo
            </Typography>
            <FormControl fullWidth>
              <Select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  }
                }}
              >
                <MenuItem value='newest'>Mới nhất</MenuItem>
                <MenuItem value='oldest'>Cũ nhất</MenuItem>
                <MenuItem value='price-asc'>Giá tăng dần</MenuItem>
                <MenuItem value='price-desc'>Giá giảm dần</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant='subtitle1' fontWeight='medium' gutterBottom>
              Khoảng giá (VND)
            </Typography>
            <Box sx={{ px: { xs: 1, sm: 2 }, py: 1 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay='auto'
                min={0}
                max={100000000}
                step={1000000}
                valueLabelFormat={formatPrice}
                sx={{
                  color: 'primary.main',
                  '& .MuiSlider-thumb': {
                    width: { xs: 24, sm: 20 },
                    height: { xs: 24, sm: 20 }
                  }
                }}
              />
            </Box>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mt: 2,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <TextField
                label='Giá tối thiểu'
                type='number'
                value={priceRange[0]}
                onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                fullWidth
                InputProps={{
                  endAdornment: <Typography>VND</Typography>,
                  sx: { borderRadius: 2 }
                }}
                helperText={formatPrice(priceRange[0])}
              />
              <TextField
                label='Giá tối đa'
                type='number'
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                fullWidth
                InputProps={{
                  endAdornment: <Typography>VND</Typography>,
                  sx: { borderRadius: 2 }
                }}
                helperText={formatPrice(priceRange[1])}
              />
            </Box>
          </Box>

          <Divider />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              pt: 1,
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            <Button 
              variant='outlined' 
              startIcon={<RestartAltIcon />} 
              onClick={handleReset} 
              sx={{ 
                borderRadius: 2,
                order: { xs: 2, sm: 1 }
              }}
            >
              Đặt lại
            </Button>
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              order: { xs: 1, sm: 2 }
            }}>
              <Button 
                variant='outlined' 
                onClick={onClose} 
                sx={{ borderRadius: 2 }}
                fullWidth
              >
                Hủy
              </Button>
              <Button 
                variant='contained' 
                onClick={handleApply}
                sx={{ borderRadius: 2 }}
                fullWidth
              >
                Áp dụng
              </Button>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default ProductFilterModal
