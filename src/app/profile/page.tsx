'use client'

import AddressSection from '@/components/profile/MyAddress'
import OrderHistory from '@/components/profile/OrderHistory'
import ProfileInformation from '@/components/profile/ProfileInformation'
import { AddressSkeleton, OrderHistorySkeleton, ProfileInformationSkeleton } from '@/components/profile/ProfileSkeleton'
import { useFetchAddressList } from '@/hooks/apis/address'
import { useFetchGetMyOrders } from '@/hooks/apis/order'
import { useFetchCurrentUserProfile, useFetchUpdateAvatar, useFetchUpdateProfile } from '@/hooks/apis/profile'
import { Box, Grid, Typography } from '@mui/material'
import { toast } from 'react-toastify'

export default function ProfilePage() {
  // Profile data
  const { data: profileData, isLoading: profileLoading, refetch: profileRefetch } = useFetchCurrentUserProfile()
  
  // Profile mutations
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useFetchUpdateProfile({
    onSuccess: () => {
      profileRefetch()
      toast.success('Cập nhật thông tin thành công')
    },
    onError: (error) => {
      toast.error(error.message || 'Cập nhật thông tin thất bại')
    }
  })

  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useFetchUpdateAvatar({
    onSuccess: () => {
      profileRefetch()
      toast.success('Cập nhật ảnh đại diện thành công')
    },
    onError: (error) => {
      toast.error(error.message || 'Cập nhật ảnh đại diện thất bại')
    }
  })
  
  // Address data
  const { data: addressData, isLoading: addressLoading, refetch: addressRefetch } = useFetchAddressList()
  
  // Order data
  const { data: orderData, isLoading: orderLoading, refetch: orderRefetch } = useFetchGetMyOrders()

  return (
    <Box>
      <Typography variant='h4' component='h1' fontWeight='bold' mb={4}>
        Tài Khoản Của Tôi
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column - Profile Info */}
        <Grid size={{ xs: 12, lg: 3 }}>
          {profileLoading ? (
            <ProfileInformationSkeleton />
          ) : (
            <ProfileInformation 
              profileData={profileData!} 
              onUpdateProfile={updateProfile}
              onUpdateAvatar={updateAvatar}
              isUpdatingProfile={isUpdatingProfile}
              isUpdatingAvatar={isUpdatingAvatar}
            />
          )}
        </Grid>

        {/* Right Column - Addresses and Orders */}
        <Grid size={{ xs: 12, lg: 9 }}>
          <Grid container spacing={4}>
            {/* Address Section */}
            <Grid size={12}>
              {addressLoading ? (
                <AddressSkeleton />
              ) : (
                <AddressSection 
                  addressData={addressData}
                  addressRefetch={addressRefetch}
                />
              )}
            </Grid>

            {/* Order History with spacing */}
            <Grid size={12}>
              {orderLoading ? (
                <OrderHistorySkeleton />
              ) : (
                <OrderHistory 
                  orderData={orderData}
                  orderRefetch={orderRefetch}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
