'use client'

import AddressSection from '@/components/profile/MyAddress'
import OrderHistory from '@/components/profile/OrderHistory'
import ProfileInformation from '@/components/profile/ProfileInformation'
import { AddressSkeleton, OrderHistorySkeleton, ProfileInformationSkeleton } from '@/components/profile/ProfileSkeleton'
import ReturnHistory from '@/components/profile/ReturnHistory'
import { UserProvider, useUserContext } from '@/context/UserContext'
import { Box, Grid, Typography } from '@mui/material'

// Wrapper component to use the context
function ProfileContent() {
  const { profileData, profileLoading, updateProfile, updateAvatar, isUpdatingProfile, isUpdatingAvatar, addressData, addressLoading, addressRefetch, orderData, orderLoading, orderRefetch } =
    useUserContext()

  return (
    <Box>
      <Typography variant='h4' component='h1' fontWeight='bold' mb={4}>
        Tài Khoản Của Tôi
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column - Profile Info and Change Password */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Grid container spacing={4}>
            {/* Profile Information */}
            <Grid size={{ xs: 12 }}>
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
          </Grid>
        </Grid>

        {/* Right Column - Addresses and Orders */}
        <Grid size={{ xs: 12, lg: 9 }}>
          <Grid container spacing={4}>
            {/* Address Section */}
            <Grid size={{ xs: 12 }}>{addressLoading ? <AddressSkeleton /> : <AddressSection addressData={addressData} addressRefetch={addressRefetch} />}</Grid>

            {/* Order History with spacing */}
            <Grid size={{ xs: 12 }}>{orderLoading ? <OrderHistorySkeleton /> : <OrderHistory orderData={orderData} orderRefetch={orderRefetch} />}</Grid>
            {/* Return History with spacing */}
            <Grid size={{ xs: 12 }}>
              <ReturnHistory />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

// Main page component with provider
export default function ProfilePage() {
  return (
    <UserProvider>
      <ProfileContent />
    </UserProvider>
  )
}
