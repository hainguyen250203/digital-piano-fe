'use client'

import { ProductListData, useFetchProductList } from '@/hooks/apis/product'
import { useDebounce } from '@/hooks/useDebounce'
import { formatCurrency } from '@/utils/format'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { Avatar, Box, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showResults, setShowResults] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const theme = useTheme()
  const router = useRouter()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  // In-memory cache to prevent unnecessary rerenders
  const [resultsCache, setResultsCache] = useState<Record<string, ProductListData[]>>({})

  // Fetch all products
  const { data, isLoading } = useFetchProductList()

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    // Return cached results if available and search term hasn't changed
    if (debouncedSearchTerm && resultsCache[debouncedSearchTerm]) {
      return resultsCache[debouncedSearchTerm]
    }
    
    if (!data?.data || !debouncedSearchTerm) return []
    
    const results = data.data
      .filter((product: ProductListData) => 
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      .slice(0, 6) // Limit to 6 suggestions for better UX
      
    // Cache results for this search term
    if (debouncedSearchTerm) {
      setResultsCache(prev => ({ ...prev, [debouncedSearchTerm]: results }))
    }
    
    return results
  }, [data?.data, debouncedSearchTerm, resultsCache])

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if click is outside search component
      const searchElement = document.getElementById('product-search')
      if (searchElement && !searchElement.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])
  
  // Close results when pressing escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowResults(false)
      }
    }
    
    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setShowResults(true)
  }
  
  const handleSearchFocus = () => {
    if (searchTerm) {
      setShowResults(true)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSearchTerm('')
    setShowResults(false)
  }

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`)
    setShowResults(false)
  }

  // Only show SearchBar on tablet and desktop
  if (isMobile) return null

  return (
    <Box
      id="product-search"
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: { sm: '400px', md: '500px', lg: '600px', xl: '700px' }
      }}
      onClick={e => e.stopPropagation()}
    >
      <TextField
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={handleSearchFocus}
        placeholder='Search products...'
        variant='outlined'
        size='small'
        sx={{
          '& .MuiOutlinedInput-root': {
            'borderRadius': '20px',
            'backgroundColor': 'white',
            'boxShadow': '0 2px 5px rgba(0,0,0,0.05)',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            },
            '&.Mui-focused': {
              boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon color='action' />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position='end'>
              <IconButton size='small' onClick={handleClear} edge='end' aria-label="Clear search">
                <CloseIcon fontSize='small' />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {showResults && searchTerm && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            width: '100%',
            mt: 0.5,
            zIndex: 1000,
            borderRadius: 1,
            maxHeight: '400px',
            overflow: 'auto',
            display: filteredProducts.length ? 'block' : 'none'
          }}
        >
          <List disablePadding>
            {isLoading ? (
              <ListItem sx={{ justifyContent: 'center', py: 2 }}>
                <Typography>Loading...</Typography>
              </ListItem>
            ) : filteredProducts.length === 0 ? (
              <ListItem sx={{ justifyContent: 'center', py: 2 }}>
                <Typography>No products found</Typography>
              </ListItem>
            ) : (
              filteredProducts.map((product: ProductListData) => (
                <ListItem
                  key={product.id}
                  divider
                  onClick={() => handleProductClick(product.id)}
                  sx={{
                    'padding': 1.5,
                    'transition': 'background-color 0.2s',
                    'cursor': 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar variant='rounded' sx={{ width: 60, height: 60, borderRadius: 1 }}>
                      {product.defaultImage ? (
                        <Image 
                          src={product.defaultImage.url} 
                          alt={product.name} 
                          width={60} 
                          height={60} 
                          style={{ objectFit: 'contain' }}
                          priority={true}
                        />
                      ) : (
                        <Box sx={{ bgcolor: 'grey.300', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant='caption' color='text.secondary'>
                            No image
                          </Typography>
                        </Box>
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant='body2' fontWeight='medium' sx={{ mb: 0.5 }}>
                        {product.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant='body2' color='error' fontWeight='medium'>
                        {product.salePrice ? (
                          <Box>
                            <Typography component='span' color='error' fontWeight='medium'>
                              {formatCurrency(product.salePrice)}
                            </Typography>
                            <Typography
                              component='span'
                              sx={{
                                color: 'text.secondary',
                                textDecoration: 'line-through',
                                ml: 1,
                                fontSize: '0.8rem'
                              }}
                            >
                              {formatCurrency(product.price)}
                            </Typography>
                          </Box>
                        ) : (
                          formatCurrency(product.price)
                        )}
                      </Typography>
                    }
                    sx={{ ml: 1 }}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}
    </Box>
  )
}
