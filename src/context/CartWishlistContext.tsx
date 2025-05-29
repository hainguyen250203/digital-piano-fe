'use client'

import { useFetchAddToCart, useFetchDeleteCartItem, useFetchGetCart, useFetchUpdateCartItem } from '@/hooks/apis/cart'
import { useAddToWishlist, useDeleteFromWishlistByProduct, useFetchWishlist } from '@/hooks/apis/wishlist'
import { QueryKey } from '@/models/QueryKey'
import { WishlistItemData } from '@/services/apis/wishlist'
import { AddProductToCart, ResCartType } from '@/types/cart.type'
import { useQueryClient } from '@tanstack/react-query'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

// Define context types
interface CartWishlistContextType {
  // Cart state
  cartData: ResCartType | null
  cartCount: number
  cartLoading: boolean

  // Cart actions
  addToCart: (product: AddProductToCart) => void
  updateCartItem: (cartItemId: string, quantity: number) => void
  removeCartItem: (cartItemId: string) => void
  isAddingToCart: (productId: string) => boolean
  isUpdatingCart: (cartItemId: string) => boolean
  isDeletingCartItem: (cartItemId: string) => boolean

  // Wishlist state
  wishlistData: WishlistItemData[] | null
  wishlistCount: number
  wishlistLoading: boolean

  // Wishlist actions
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  isAddingToWishlist: (productId: string) => boolean
  isDeletingWishlistItem: (productId: string) => boolean

  // Check methods
  isInWishlist: (productId: string) => boolean
  refreshCart: () => void
  refreshWishlist: () => void
}

// Create context
const CartWishlistContext = createContext<CartWishlistContextType | null>(null)

// Provider component
interface CartWishlistProviderProps {
  children: ReactNode
}

export function CartWishlistProvider({ children }: CartWishlistProviderProps) {
  const queryClient = useQueryClient()

  // Local state
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  // Track loading states by product ID
  const [addingToCartIds, setAddingToCartIds] = useState<Set<string>>(new Set())
  const [updatingCartItemIds, setUpdatingCartItemIds] = useState<Set<string>>(new Set())
  const [deletingCartItemIds, setDeletingCartItemIds] = useState<Set<string>>(new Set())
  const [addingToWishlistIds, setAddingToWishlistIds] = useState<Set<string>>(new Set())
  const [deletingWishlistItemIds, setDeletingWishlistItemIds] = useState<Set<string>>(new Set())

  // Fetch cart data
  const { data: cartResponse, isLoading: cartLoading, refetch: refetchCart } = useFetchGetCart()

  // Fetch wishlist data
  const { data: wishlistResponse, isLoading: wishlistLoading, refetch: refetchWishlist } = useFetchWishlist()

  // Cart mutations
  const { mutate: addToCartMutation } = useFetchAddToCart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_CART] })
      toast.success('Đã thêm vào giỏ hàng', { position: 'top-center' })
    },
    onError: error => {
      if (error.errorCode === 4) {
        toast.error('Vui lòng đăng nhập để sử dụng tính năng này', { position: 'top-center' })
      } else {
        toast.error(error.message || 'Lỗi khi thêm vào giỏ hàng', { position: 'top-center' })
      }
    }
  })

  const { mutate: updateCartItemMutation } = useFetchUpdateCartItem({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_CART] })
    },
    onError: error => {
      toast.error(error.message || 'Lỗi khi cập nhật giỏ hàng', { position: 'top-center' })
    }
  })

  const { mutate: removeCartItemMutation } = useFetchDeleteCartItem({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_CART] })
    },
    onError: error => {
      toast.error(error.message || 'Lỗi khi xóa sản phẩm khỏi giỏ hàng', { position: 'top-center' })
    }
  })

  // Wishlist mutations
  const { mutate: addToWishlistMutation } = useAddToWishlist({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.WISHLIST_LIST] })
    },
    onError: error => {
      if (error.errorCode === 4) {
        toast.error('Vui lòng đăng nhập để sử dụng tính năng này', { position: 'top-center' })
      } else {
        toast.error(error.message || 'Lỗi khi thêm vào danh sách yêu thích', { position: 'top-center' })
      }
    }
  })

  const { mutate: removeFromWishlistMutation } = useDeleteFromWishlistByProduct({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.WISHLIST_LIST] })
    },
    onError: error => {
      toast.error(error.message || 'Lỗi khi xóa khỏi danh sách yêu thích', { position: 'top-center' })
    }
  })

  // Update counts when data changes
  useEffect(() => {
    if (cartResponse?.data) {
      setCartCount(cartResponse.data.totalQuantity || 0)
    }
  }, [cartResponse])

  useEffect(() => {
    if (wishlistResponse?.data) {
      setWishlistCount(wishlistResponse.data.length || 0)
    }
  }, [wishlistResponse])

  // Helper functions
  const isInWishlist = (productId: string): boolean => {
    if (!wishlistResponse?.data) return false
    return wishlistResponse.data.some(item => item.product.id === productId)
  }

  // Action handlers
  const addToCart = (product: AddProductToCart) => {
    const { productId } = product
    setAddingToCartIds(prev => new Set(prev).add(productId))

    addToCartMutation(product, {
      onSettled: () => {
        setAddingToCartIds(prev => {
          const updatedSet = new Set(prev)
          updatedSet.delete(productId)
          return updatedSet
        })
      }
    })
  }

  const updateCartItem = (cartItemId: string, quantity: number) => {
    setUpdatingCartItemIds(prev => new Set(prev).add(cartItemId))

    updateCartItemMutation(
      { cartItemId, quantity },
      {
        onSettled: () => {
          setUpdatingCartItemIds(prev => {
            const updatedSet = new Set(prev)
            updatedSet.delete(cartItemId)
            return updatedSet
          })
        }
      }
    )
  }

  const removeCartItem = (cartItemId: string) => {
    setDeletingCartItemIds(prev => new Set(prev).add(cartItemId))

    removeCartItemMutation(cartItemId, {
      onSettled: () => {
        setDeletingCartItemIds(prev => {
          const updatedSet = new Set(prev)
          updatedSet.delete(cartItemId)
          return updatedSet
        })
      }
    })
  }

  const addToWishlist = (productId: string) => {
    setAddingToWishlistIds(prev => new Set(prev).add(productId))

    addToWishlistMutation(productId, {
      onSettled: () => {
        setAddingToWishlistIds(prev => {
          const updatedSet = new Set(prev)
          updatedSet.delete(productId)
          return updatedSet
        })
      }
    })
  }

  const removeFromWishlist = (productId: string) => {
    setDeletingWishlistItemIds(prev => new Set(prev).add(productId))

    removeFromWishlistMutation(productId, {
      onSettled: () => {
        setDeletingWishlistItemIds(prev => {
          const updatedSet = new Set(prev)
          updatedSet.delete(productId)
          return updatedSet
        })
      }
    })
  }

  // Check loading state by ID
  const isAddingToCart = (productId: string): boolean => {
    return addingToCartIds.has(productId)
  }

  const isUpdatingCart = (cartItemId: string): boolean => {
    return updatingCartItemIds.has(cartItemId)
  }

  const isDeletingCartItem = (cartItemId: string): boolean => {
    return deletingCartItemIds.has(cartItemId)
  }

  const isAddingToWishlist = (productId: string): boolean => {
    return addingToWishlistIds.has(productId)
  }

  const isDeletingWishlistItem = (productId: string): boolean => {
    return deletingWishlistItemIds.has(productId)
  }

  // Manual refresh methods
  const refreshCart = () => {
    refetchCart()
  }

  const refreshWishlist = () => {
    refetchWishlist()
  }

  // Create context value
  const contextValue: CartWishlistContextType = {
    // Cart
    cartData: cartResponse?.data || null,
    cartCount,
    cartLoading,
    addToCart,
    updateCartItem,
    removeCartItem,
    isAddingToCart,
    isUpdatingCart,
    isDeletingCartItem,

    // Wishlist
    wishlistData: wishlistResponse?.data || null,
    wishlistCount,
    wishlistLoading,
    addToWishlist,
    removeFromWishlist,
    isAddingToWishlist,
    isDeletingWishlistItem,

    // Helpers
    isInWishlist,
    refreshCart,
    refreshWishlist
  }

  return <CartWishlistContext.Provider value={contextValue}>{children}</CartWishlistContext.Provider>
}

// Custom hook to use the context
export function useCartWishlist() {
  const context = useContext(CartWishlistContext)

  if (!context) {
    throw new Error('useCartWishlist must be used within CartWishlistProvider')
  }

  return context
}
