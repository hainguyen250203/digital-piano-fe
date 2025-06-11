'use client'
import ProductItem from '@/components/Product/ProductItem'
import ProductSkeleton from '@/components/Product/ProductSkeleton'
import { ProductListData } from '@/types/product.type'
import { Box, Grid } from '@mui/material'

interface ProductListProps {
  products: ProductListData[]
  isLoading?: boolean
  error?: Error | null | undefined
}

export default function ProductList({ products, isLoading, error }: ProductListProps) {
  // Show skeleton on loading, error, or when products are not available
  if (isLoading || error || !products || !Array.isArray(products) || products.length === 0) {
    return <ProductSkeleton count={8} />
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {products.map((product: ProductListData) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ProductItem product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
