'use client'

import { useFetchAddressList } from '@/hooks/apis/address'
import { useFetchGetMyOrders } from '@/hooks/apis/order'
import { useFetchCurrentUserProfile, useFetchUpdateAvatar, useFetchUpdateProfile } from '@/hooks/apis/profile'
import { UserData } from '@/hooks/apis/user'
import { ResponseAddress } from '@/types/address.type'
import { BaseResponse } from '@/types/base-response'
import { ResponseOrder } from '@/types/order.type'
import { createContext, ReactNode, useContext } from 'react'
import { toast } from 'react-toastify'

// Define the shape of the context
interface UserContextType {
  // Profile data
  profileData: BaseResponse<UserData> | undefined
  profileLoading: boolean
  profileRefetch: () => void

  // Profile mutations
  updateProfile: (data: { phoneNumber: string | undefined }) => void
  isUpdatingProfile: boolean

  updateAvatar: (formData: FormData) => void
  isUpdatingAvatar: boolean

  // Address data
  addressData: BaseResponse<ResponseAddress[]> | undefined
  addressLoading: boolean
  addressRefetch: () => void

  // Order data
  orderData: BaseResponse<ResponseOrder[]> | undefined
  orderLoading: boolean
  orderRefetch: () => void
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider component
interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  // Profile data
  const { data: profileData, isLoading: profileLoading, refetch: profileRefetch } = useFetchCurrentUserProfile()

  // Profile mutations
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useFetchUpdateProfile({
    onSuccess: () => {
      profileRefetch()
      toast.success('Cập nhật thông tin thành công')
    },
    onError: error => {
      toast.error(error.message || 'Cập nhật thông tin thất bại')
    }
  })

  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useFetchUpdateAvatar({
    onSuccess: () => {
      profileRefetch()
      toast.success('Cập nhật ảnh đại diện thành công')
    },
    onError: error => {
      toast.error(error.message || 'Cập nhật ảnh đại diện thất bại')
    }
  })

  // Address data
  const { data: addressData, isLoading: addressLoading, refetch: addressRefetch } = useFetchAddressList()

  // Order data
  const { data: orderData, isLoading: orderLoading, refetch: orderRefetch } = useFetchGetMyOrders()

  // Create the context value object
  const contextValue: UserContextType = {
    profileData,
    profileLoading,
    profileRefetch,

    updateProfile,
    isUpdatingProfile,

    updateAvatar,
    isUpdatingAvatar,

    addressData,
    addressLoading,
    addressRefetch,

    orderData,
    orderLoading,
    orderRefetch
  }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

// Custom hook to use the user context
export function useUserContext() {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider')
  }

  return context
}
