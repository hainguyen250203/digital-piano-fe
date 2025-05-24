'use client'
import ProductFilterModal from '@/components/Product/ProductFilterModal'
import ProductList from '@/components/Product/ProductList'
import ProductSkeleton from '@/components/Product/ProductSkeleton'
import { ProductListData, useFetchProductFeatured, useFetchProductHotSale, useFetchProductList } from '@/hooks/apis/product'
import { useProductFilters } from '@/hooks/useProductFilters'
import { Clear, FilterList, NavigateNext, Search } from '@mui/icons-material'
import { alpha, Box, Breadcrumbs, Button, Container, IconButton, InputBase, Pagination, Paper, Skeleton, Typography } from '@mui/material'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

// Custom hook for pagination
const usePagination = (items: ProductListData[] = [], itemsPerPage: number = 12) => {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil((items?.length || 0) / itemsPerPage)

  const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    page,
    totalPages,
    paginatedItems,
    handlePageChange
  }
}

// Product Page skeleton component
const ProductsPageSkeleton = () => (
  <Container maxWidth='xl'>
    <Box sx={{ py: 4 }}>
      <Skeleton variant='text' width={300} height={40} sx={{ mb: 1 }} />
      <Box sx={{ mb: 4 }}>
        <Skeleton variant='text' width={500} height={40} sx={{ mb: 1 }} />
        <Skeleton variant='text' width={400} height={24} sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Skeleton variant='rectangular' width='100%' height={48} sx={{ borderRadius: 2 }} />
          <Skeleton variant='rectangular' width={120} height={48} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>
      <ProductSkeleton count={12} />
    </Box>
  </Container>
)

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const filterParam = searchParams ? searchParams.get('filter') : null
  
  const { data: allProducts, isLoading: allProductsLoading, error: allProductsError } = useFetchProductList()
  const { data: hotSaleProducts, isLoading: hotSaleLoading, error: hotSaleError } = useFetchProductHotSale()
  const { data: featuredProducts, isLoading: featuredLoading, error: featuredError } = useFetchProductFeatured()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [pageTitle, setPageTitle] = useState('Products')
  const [pageDescription, setPageDescription] = useState('Khám phá bộ sưu tập các sản phẩm chất lượng cao từ những thương hiệu hàng đầu.')
  
  // Determine which products to display based on the filter param
  const [productsToDisplay, setProductsToDisplay] = useState<ProductListData[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    if (filterParam === 'hotsale') {
      setPageTitle('Hot Sale Products')
      setPageDescription('Khám phá các sản phẩm đang được giảm giá đặc biệt với nhiều ưu đãi hấp dẫn.')
      setProductsToDisplay(hotSaleProducts)
      setIsLoading(hotSaleLoading)
      setError(hotSaleError)
    } else if (filterParam === 'featured') {
      setPageTitle('Featured Products')
      setPageDescription('Những sản phẩm nổi bật và được ưa chuộng nhất của chúng tôi.')
      setProductsToDisplay(featuredProducts)
      setIsLoading(featuredLoading)
      setError(featuredError)
    } else {
      setPageTitle('Products')
      setPageDescription('Khám phá bộ sưu tập các sản phẩm chất lượng cao từ những thương hiệu hàng đầu.')
      setProductsToDisplay(allProducts?.data)
      setIsLoading(allProductsLoading)
      setError(allProductsError)
    }
  }, [
    filterParam, 
    hotSaleProducts, hotSaleLoading, hotSaleError,
    featuredProducts, featuredLoading, featuredError,
    allProducts, allProductsLoading, allProductsError
  ])
  
  const { setFilters, filteredAndSortedProducts } = useProductFilters(productsToDisplay)
  const { page, totalPages, paginatedItems, handlePageChange } = usePagination(
    filteredAndSortedProducts?.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const handleFilterApply = (newFilters: { sortBy: string; priceRange: [number, number] }) => {
    setFilters(newFilters)
  }

  const handleSearchClear = () => {
    setSearchQuery('')
  }

  if (isLoading) {
    return <ProductsPageSkeleton />
  }

  return (
    <Container maxWidth='xl'>
      <Box sx={{ py: 4 }}>
        <Breadcrumbs separator={<NavigateNext fontSize='small' />} aria-label='breadcrumb' sx={{ mb: 2 }}>
          <Link href='/' style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography color='text.secondary'>Home</Typography>
          </Link>
          <Typography color='text.primary'>{pageTitle}</Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2
            }}
          >
            <Box>
              <Typography variant='h4' component='h1' gutterBottom fontWeight='bold'>
                {pageTitle}
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                {pageDescription}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, minWidth: { sm: '420px' } }}>
              <Paper
                elevation={0}
                sx={{
                  'p': '2px',
                  'display': 'flex',
                  'alignItems': 'center',
                  'flex': 1,
                  'height': '48px',
                  'border': '1px solid',
                  'borderColor': 'divider',
                  'borderRadius': 2,
                  'bgcolor': 'background.paper',
                  'transition': 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: theme => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`
                  },
                  '&:focus-within': {
                    borderColor: 'primary.main',
                    boxShadow: theme => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                  }
                }}
              >
                <IconButton
                  sx={{
                    'p': '12px',
                    'color': 'action.active',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                  aria-label='search'
                >
                  <Search />
                </IconButton>
                <InputBase
                  sx={{
                    'ml': 1,
                    'flex': 1,
                    '& .MuiInputBase-input': {
                      'py': 1.25,
                      'transition': 'all 0.2s',
                      '&::placeholder': {
                        transition: 'all 0.2s',
                        opacity: 0.7
                      },
                      '&:focus::placeholder': {
                        opacity: 0.5
                      }
                    }
                  }}
                  placeholder='Tìm kiếm sản phẩm...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <IconButton
                    sx={{
                      'p': '12px',
                      'color': 'action.active',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                    aria-label='clear search'
                    onClick={handleSearchClear}
                  >
                    <Clear />
                  </IconButton>
                )}
              </Paper>
              <Button
                variant='outlined'
                startIcon={<FilterList />}
                onClick={() => setIsFilterModalOpen(true)}
                sx={{
                  'minWidth': '120px',
                  'height': '48px',
                  'borderRadius': 2,
                  'borderColor': 'divider',
                  'color': 'text.primary',
                  'display': 'flex',
                  'alignItems': 'center',
                  'px': 2,
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: alpha('#fff', 0.05)
                  }
                }}
              >
                Bộ Lọc
              </Button>
            </Box>
          </Box>
        </Box>

        <ProductList 
          products={paginatedItems}
          error={error}
          isLoading={isLoading}
        />

        {paginatedItems && paginatedItems.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color='primary' />
          </Box>
        )}

        <ProductFilterModal open={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={handleFilterApply} />
      </Box>
    </Container>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsPageContent />
    </Suspense>
  )
}
