'use client'

import { CategoryMenuData } from '@/hooks/apis/category'
import { KeyboardArrowDown } from '@mui/icons-material'
import { Box, ButtonBase, Container, Paper, Typography, alpha, styled } from '@mui/material'
import Link from 'next/link'
import { useRef, useState } from 'react'

interface DesktopMenuProps {
  categories: CategoryMenuData[]
}

// Styled components
const MenuButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 48,
  padding: '0 5px',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  transition: 'all 0.2s',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const MenuContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  // flexWrap: 'wrap', // Allow items to wrap
})

const MenuItemWrapper = styled(Box)({
  position: 'relative',
  display: 'inline-flex', // Changed to inline-flex for better wrapping
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

const SubCategoryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.95rem',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}))

const ProductTypeLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  padding: '4px 0',
  display: 'block',
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderRadius: 4,
    paddingLeft: 8,
  },
  transition: 'all 0.2s ease',
}))

export default function DesktopMenu({ categories }: DesktopMenuProps) {  
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCategoryMouseEnter = (categoryId: string) => {
    setOpenCategory(categoryId)
  }

  const handleCategoryMouseLeave = () => {
    setOpenCategory(null)
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <MenuContainer ref={menuRef}>
        {categories.map((category) => (
          <MenuItemWrapper
            key={category.id}
            onMouseEnter={() => handleCategoryMouseEnter(category.id)}
            onMouseLeave={handleCategoryMouseLeave}
          >
            <Link 
              href={`/products/category/${category.id}`}
              style={{ textDecoration: 'none' }}
            >
              <MenuButton
                sx={{
                  color: openCategory === category.id ? 'primary.main' : 'text.primary',
                  backgroundColor: openCategory === category.id ? (theme) => alpha(theme.palette.primary.main, 0.08) : 'transparent',
                }}
              >
                {category.name}
                {category.subCategories.length > 0 && (
                  <KeyboardArrowDown 
                    fontSize="small" 
                    sx={{ 
                      ml: 0.5,
                      transition: 'transform 0.3s',
                      transform: openCategory === category.id ? 'rotate(-180deg)' : 'rotate(0)',
                    }} 
                  />
                )}
              </MenuButton>
            </Link>
          </MenuItemWrapper>
        ))}
      </MenuContainer>

      {/* Full-width dropdown overlay */}
      {categories.map((category) => (
        category.subCategories.length > 0 && openCategory === category.id && (
          <Box 
            key={category.id}
            onMouseEnter={() => setOpenCategory(category.id)}
            onMouseLeave={handleCategoryMouseLeave}
            sx={{
              position: 'fixed',
              left: 0,
              right: 0,
              top: menuRef.current?.getBoundingClientRect().bottom ?? '100%',
              zIndex: 1300,
              width: '100%',
              mt: 0
            }}
          >
            <Container maxWidth="xl">
              <SubMenuWrapper>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3, width: '100%' }}>
                  {category.subCategories.map((subCategory) => (
                    <Box key={subCategory.id}>
                      <Link
                        href={`/products/sub-category/${subCategory.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <SubCategoryTitle>
                          {subCategory.name}
                        </SubCategoryTitle>
                      </Link>

                      <Box sx={{ pl: 1 }}>
                        {subCategory.productTypes.map((productType) => (
                          <ProductTypeLink key={productType.id} href={`/products/product-type/${productType.id}`}>
                            {productType.name}
                          </ProductTypeLink>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </SubMenuWrapper>
            </Container>
          </Box>
        )
      ))}
    </Box>
  )
} 