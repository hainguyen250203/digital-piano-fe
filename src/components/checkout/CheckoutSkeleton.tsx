import { Box, Card, CardContent, Divider, Grid, Skeleton, Stack } from '@mui/material'

export default function CheckoutSkeleton() {
  return (
    <Box sx={{ py: 4 }}>
      <Skeleton variant='text' width={200} height={40} sx={{ mb: 4 }} />

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Skeleton variant='text' width={100} height={30} sx={{ mb: 2 }} />
              <Divider sx={{ mb: 2 }} />
              {[1, 2].map(item => (
                <Box key={item} sx={{ display: 'flex', mb: 2, py: 1 }}>
                  <Skeleton variant='rectangular' width={80} height={80} sx={{ mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant='text' width='60%' height={24} />
                    <Skeleton variant='text' width='40%' height={20} sx={{ mb: 1 }} />
                    <Skeleton variant='text' width='30%' height={24} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Skeleton variant='text' width={150} height={30} sx={{ mb: 2 }} />
              <Divider sx={{ mb: 2 }} />
              <Skeleton variant='rectangular' height={56} sx={{ mb: 2 }} />
              <Skeleton variant='text' width={120} height={24} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Skeleton variant='text' width={120} height={30} sx={{ mb: 2 }} />
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
                {[1, 2, 3].map(item => (
                  <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Skeleton variant='text' width={80} height={24} />
                    <Skeleton variant='text' width={60} height={24} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Skeleton variant='rectangular' width='100%' height={56} sx={{ borderRadius: 1 }} />
        </Grid>
      </Grid>
    </Box>
  )
} 