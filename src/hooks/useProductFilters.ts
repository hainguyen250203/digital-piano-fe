import { ProductListData } from '@/hooks/apis/product'
import { useMemo, useState } from 'react'

interface FilterState {
  sortBy: string
  priceRange: [number, number]
}

export const useProductFilters = (products: ProductListData[] = []) => {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'newest',
    priceRange: [0, 100000000]
  })

  const filteredAndSortedProducts = useMemo(() => {
    if (!products?.length) return []

    // First filter by price range
    const filteredByPrice = products.filter(
      (product) =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    // Then sort the filtered products
    return filteredByPrice.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        default:
          return 0
      }
    })
  }, [products, filters])

  return {
    filters,
    setFilters,
    filteredAndSortedProducts
  }
} 