'use client'

import AddressSection from '@/components/profile/MyAddress'
import OrderHistory from '@/components/profile/OrderHistory'
import ProfileInformation from '@/components/profile/ProfileInformation'
import { AddressSkeleton, OrderHistorySkeleton, ProfileInformationSkeleton } from '@/components/profile/ProfileSkeleton'
import { useFetchCurrentUserProfile } from '@/hooks/apis/profile'
import { Box, Grid, Typography } from '@mui/material'

export default function ProfilePage() {
  const { isLoading } = useFetchCurrentUserProfile()

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={4}>
        Tài Khoản Của Tôi
      </Typography>
      
      <Grid container spacing={4}>
        {/* Left Column - Profile Info */}
        <Grid size={{ xs: 12, lg: 3 }}>
          {isLoading ? <ProfileInformationSkeleton /> : <ProfileInformation />}
        </Grid>

        {/* Right Column - Addresses and Orders */}
        <Grid size={{ xs: 12, lg: 9 }}>
          <Grid container spacing={4}>
            {/* Address Section */}
            <Grid size={12}>
              {isLoading ? <AddressSkeleton /> : <AddressSection />}
            </Grid>

            {/* Order History with spacing */}
            <Grid size={12}>
              {isLoading ? <OrderHistorySkeleton /> : <OrderHistory />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
