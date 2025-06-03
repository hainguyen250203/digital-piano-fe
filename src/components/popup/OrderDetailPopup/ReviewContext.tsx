'use client'

import { useFetchCreateReview, useFetchDeleteReview, useFetchUpdateReview } from '@/hooks/apis/review'
import { BaseResponse } from '@/types/base-response'
import { OrderItem, ProductReview } from '@/types/order.type'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { toast } from 'react-toastify'

interface ReviewFormData {
  id?: string
  orderItemId: string
  productId: string
  rating: number
  content: string
}

interface ReviewContextType {
  reviewForm: ReviewFormData | null
  isEditMode: boolean
  localReviews: Record<string, ProductReview>
  isCreatingReview: boolean
  isUpdatingReview: boolean
  isDeletingReview: boolean
  findReviewForItem: (item: OrderItem) => ProductReview | null
  shouldShowReviewForm: (itemId: string) => boolean
  handleOpenReviewForm: (item: OrderItem) => void
  handleEditReview: (review: ProductReview) => void
  handleDeleteReview: (reviewId: string) => void
  handleSubmitReview: () => void
  handleCancelReview: () => void
  handleRatingChange: (newValue: number | null) => void
  handleContentChange: (content: string) => void
  updateLocalReviews: (items: OrderItem[]) => void
}

const ReviewContext = createContext<ReviewContextType | null>(null)

export const useReview = () => {
  const context = useContext(ReviewContext)
  if (!context) {
    throw new Error('useReview must be used within a ReviewContextProvider')
  }
  return context
}

interface ReviewContextProviderProps {
  children: ReactNode
  orderId: string
  refreshOrder: (orderId: string) => void
}

export const ReviewContextProvider = ({ children, orderId, refreshOrder }: ReviewContextProviderProps) => {
  const [reviewForm, setReviewForm] = useState<ReviewFormData | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [localReviews, setLocalReviews] = useState<Record<string, ProductReview>>({})
  const [reviewIdToDelete, setReviewIdToDelete] = useState<string | null>(null)

  // Create review mutation
  const { mutate: createReview, isPending: isCreatingReview } = useFetchCreateReview({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (_data: BaseResponse<null>) => {
      toast.success('Đánh giá đã được gửi thành công')
      
      if (reviewForm) {
        const newReview: ProductReview = {
          id: `temp-${Date.now()}`,
          userId: '',
          productId: reviewForm.productId,
          orderItemId: reviewForm.orderItemId,
          rating: reviewForm.rating,
          content: reviewForm.content,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        setLocalReviews(prev => ({
          ...prev,
          [reviewForm.orderItemId]: newReview
        }))
      }
      
      setReviewForm(null)
      
      // Fetch the updated data in the background for eventual consistency
      if (orderId) {
        setTimeout(() => refreshOrder(orderId), 500)
      }
    },
    onError: error => {
      toast.error(error?.message || 'Gửi đánh giá thất bại')
    }
  })

  // Update review mutation
  const { mutate: updateReview, isPending: isUpdatingReview } = useFetchUpdateReview({
    onSuccess: () => {
      toast.success('Đánh giá đã được cập nhật thành công')
      
      if (reviewForm?.id && reviewForm.orderItemId) {
        const existingReview = localReviews[reviewForm.orderItemId]
        
        if (existingReview) {
          const updatedReview: ProductReview = {
            ...existingReview,
            rating: reviewForm.rating,
            content: reviewForm.content,
            updatedAt: new Date().toISOString()
          }
          
          setLocalReviews(prev => ({
            ...prev,
            [reviewForm.orderItemId]: updatedReview
          }))
        }
      }
      
      setReviewForm(null)
      setIsEditMode(false)
      
      // Fetch the updated data in the background for eventual consistency
      if (orderId) {
        setTimeout(() => refreshOrder(orderId), 500)
      }
    },
    onError: error => {
      toast.error(error?.message || 'Cập nhật đánh giá thất bại')
    }
  })

  // Delete review mutation
  const { mutate: deleteReview, isPending: isDeletingReview } = useFetchDeleteReview({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (data: BaseResponse<null>) => {
      toast.success('Đã xóa đánh giá thành công')
      
      if (reviewIdToDelete) {
        const orderItemId = Object.keys(localReviews).find(
          key => localReviews[key]?.id === reviewIdToDelete
        )
        
        if (orderItemId) {
          setLocalReviews(prev => {
            const newState = { ...prev }
            delete newState[orderItemId]
            return newState
          })
        }
        
        setReviewIdToDelete(null)
      }
      
      // Fetch the updated data in the background for eventual consistency
      if (orderId) {
        setTimeout(() => refreshOrder(orderId), 500)
      }
    },
    onError: error => {
      setReviewIdToDelete(null)
      toast.error(error?.message || 'Xóa đánh giá thất bại')
    }
  })

  // Initialize reviews from updated order data
  const updateLocalReviews = useCallback((items: OrderItem[]) => {
    const reviewsMap: Record<string, ProductReview> = {}
    
    items.forEach((item: OrderItem) => {
      if (item.product?.reviews && Array.isArray(item.product.reviews)) {
        const review = item.product.reviews.find(r => r.orderItemId === item.id)
        if (review) {
          reviewsMap[item.id] = review
        }
      }
    })
    
    // Merge with existing local reviews to preserve any pending changes
    setLocalReviews(prev => ({
      ...reviewsMap,
      ...prev
    }))
  }, [])

  // Review interaction handlers
  const handleOpenReviewForm = useCallback((item: OrderItem) => {
    setReviewForm({
      orderItemId: item.id,
      productId: item.productId,
      rating: 5,
      content: ''
    })
    setIsEditMode(false)
  }, [])

  const handleEditReview = useCallback((review: ProductReview) => {
    setReviewForm({
      id: review.id,
      orderItemId: review.orderItemId,
      productId: review.productId,
      rating: review.rating,
      content: review.content
    })
    setIsEditMode(true)
  }, [])

  const handleDeleteReview = useCallback(
    (reviewId: string) => {
      if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
        setReviewIdToDelete(reviewId)
        deleteReview({ id: reviewId })
      }
    },
    [deleteReview]
  )

  const handleSubmitReview = useCallback(() => {
    if (!reviewForm) return

    if (isEditMode && reviewForm.id) {
      updateReview({
        id: reviewForm.id,
        rating: reviewForm.rating,
        content: reviewForm.content
      })
    } else {
      createReview({
        orderItemId: reviewForm.orderItemId,
        productId: reviewForm.productId,
        rating: reviewForm.rating,
        content: reviewForm.content
      })
    }
  }, [reviewForm, isEditMode, updateReview, createReview])

  const handleCancelReview = useCallback(() => {
    setReviewForm(null)
    setIsEditMode(false)
  }, [])

  // Utility functions
  const findReviewForItem = useCallback(
    (item: OrderItem) => {
      if (localReviews[item.id]) {
        return localReviews[item.id];
      }
      
      if (!item.product?.reviews || !Array.isArray(item.product.reviews)) return null;
      
      return item.product.reviews[0] || null;
    },
    [localReviews]
  )

  const shouldShowReviewForm = useCallback(
    (itemId: string) => {
      return Boolean(reviewForm && reviewForm.orderItemId === itemId)
    },
    [reviewForm]
  )

  const handleRatingChange = useCallback(
    (newValue: number | null) => {
      if (reviewForm) {
        setReviewForm(prev => ({ ...prev!, rating: newValue || 1 }))
      }
    },
    [reviewForm]
  )

  const handleContentChange = useCallback(
    (content: string) => {
      if (reviewForm) {
        setReviewForm(prev => ({ ...prev!, content }))
      }
    },
    [reviewForm]
  )

  const value = {
    reviewForm,
    isEditMode,
    localReviews,
    isCreatingReview,
    isUpdatingReview,
    isDeletingReview,
    findReviewForItem,
    shouldShowReviewForm,
    handleOpenReviewForm,
    handleEditReview,
    handleDeleteReview,
    handleSubmitReview,
    handleCancelReview,
    handleRatingChange,
    handleContentChange,
    updateLocalReviews
  }

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
} 