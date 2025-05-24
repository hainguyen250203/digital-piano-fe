'use client'

import { Box, Container, Paper, Skeleton, styled } from '@mui/material'
import { alpha } from '@mui/material/styles'

// Styled components
const MenuContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const MenuItemWrapper = styled(Box)({
  position: 'relative',
  display: 'inline-flex',
})

const SubMenuWrapper = styled(Paper)(({ theme }) => ({
  width: '100%',
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  marginTop: 8,
  border: `1px solid ${theme.palette.divider}`,
  maxHeight: 500,
  overflow: 'auto'
}))

const SkeletonMenuItem = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  bgcolor: alpha(theme.palette.primary.main, 0.08),
  '&::after': {
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`
  }
}))

const SkeletonText = styled(Skeleton)(({ theme }) => ({
  '&::after': {
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`
  }
}))

export default function MenuSkeleton() {
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <MenuContainer>
        {/* Generate 6 skeleton menu items */}
        {Array.from({ length: 6 }).map((_, index) => (
          <MenuItemWrapper key={index}>
            <SkeletonMenuItem
              variant="rounded"
              width={100}
              height={48}
              animation="wave"
            />
          </MenuItemWrapper>
        ))}
      </MenuContainer>

      {/* Skeleton submenu */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: '100%',
          zIndex: 1300,
          width: '100%',
          mt: 0
        }}
      >
        <Container maxWidth="xl">
          <SubMenuWrapper>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3, width: '100%' }}>
              {/* Generate 8 skeleton subcategories */}
              {Array.from({ length: 8 }).map((_, index) => (
                <Box key={index}>
                  <SkeletonText
                    variant="text"
                    width="60%"
                    height={24}
                    sx={{ mb: 1 }}
                    animation="wave"
                  />
                  <Box sx={{ pl: 1 }}>
                    {/* Generate 4 skeleton product types for each subcategory */}
                    {Array.from({ length: 4 }).map((_, typeIndex) => (
                      <SkeletonText
                        key={typeIndex}
                        variant="text"
                        width="80%"
                        height={20}
                        sx={{ mb: 0.5 }}
                        animation="wave"
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </SubMenuWrapper>
        </Container>
      </Box>
    </Box>
  )
} 