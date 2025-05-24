'use client'

import { CategoryMenuData } from '@/hooks/apis/category'
import { Close, KeyboardArrowDown, Menu as MenuIcon } from '@mui/icons-material'
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  alpha,
  styled
} from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'

interface MobileMenuProps {
  categories: CategoryMenuData[]
}

const MenuHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
}))

const CategoryItem = styled(ListItemButton)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  padding: theme.spacing(1.5, 2),
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
    },
  }
}))

const SubCategoryItem = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  }
}))

const ProductTypeItem = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(6),
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}))

export default function MobileMenu({ categories }: MobileMenuProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null)

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleCategoryClick = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
    // Close any open subcategories when changing categories
    setExpandedSubCategory(null)
  }

  const handleSubCategoryClick = (subCategoryId: string) => {
    setExpandedSubCategory(expandedSubCategory === subCategoryId ? null : subCategoryId)
  }

  return (
    <>
      {/* Hamburger Menu Button */}
      <IconButton 
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer}
        sx={{ mr: 1 }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer Menu */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: '85%',
            maxWidth: 360,
            boxSizing: 'border-box',
          },
        }}
      >
        {/* Menu Header */}
        <MenuHeader>
          <Typography variant="h6" fontWeight={600}>
            Menu
          </Typography>
          <IconButton edge="end" onClick={toggleDrawer}>
            <Close />
          </IconButton>
        </MenuHeader>

        {/* Menu Items */}
        <List disablePadding sx={{ pb: 8 }}>
          {categories.map((category) => (
            <Box key={category.id}>
              {/* Category with subcategories */}
              {category.subCategories.length > 0 ? (
                <CategoryItem 
                  onClick={() => handleCategoryClick(category.id)}
                  selected={expandedCategory === category.id}
                >
                  <ListItemText 
                    primary={category.name} 
                    primaryTypographyProps={{ 
                      fontWeight: expandedCategory === category.id ? 700 : 600,
                      color: expandedCategory === category.id ? 'primary.main' : 'text.primary'
                    }} 
                  />
                  <KeyboardArrowDown 
                    sx={{ 
                      transform: expandedCategory === category.id ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.3s',
                      color: expandedCategory === category.id ? 'primary.main' : 'text.secondary',
                    }} 
                  />
                </CategoryItem>
              ) : (
                // Category without subcategories - direct link
                <Link href={`/products/category/${category.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <CategoryItem>
                    <ListItemText 
                      primary={category.name} 
                      primaryTypographyProps={{ 
                        fontWeight: 600,
                        color: 'text.primary'
                      }} 
                    />
                  </CategoryItem>
                </Link>
              )}

              {/* Subcategories */}
              {category.subCategories.length > 0 && (
                <Collapse in={expandedCategory === category.id} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {category.subCategories.map((subCategory) => (
                      <Box key={subCategory.id}>
                        {/* Subcategory with product types */}
                        {subCategory.productTypes.length > 0 ? (
                          <SubCategoryItem
                            onClick={() => handleSubCategoryClick(subCategory.id)}
                            selected={expandedSubCategory === subCategory.id}
                          >
                            <ListItemText 
                              primary={subCategory.name} 
                              primaryTypographyProps={{ 
                                fontWeight: expandedSubCategory === subCategory.id ? 700 : 500,
                                fontSize: '0.95rem',
                                color: expandedSubCategory === subCategory.id ? 'primary.main' : 'text.primary'
                              }} 
                            />
                            <KeyboardArrowDown 
                              fontSize="small"
                              sx={{ 
                                transform: expandedSubCategory === subCategory.id ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.3s',
                                color: expandedSubCategory === subCategory.id ? 'primary.main' : 'text.secondary',
                              }} 
                            />
                          </SubCategoryItem>
                        ) : (
                          // Subcategory without product types - direct link
                          <Link href={`/products/sub-category/${subCategory.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                            <SubCategoryItem>
                              <ListItemText 
                                primary={subCategory.name} 
                                primaryTypographyProps={{ 
                                  fontWeight: 500,
                                  fontSize: '0.95rem',
                                  color: 'text.primary'
                                }} 
                              />
                            </SubCategoryItem>
                          </Link>
                        )}

                        {/* Product Types */}
                        {subCategory.productTypes.length > 0 && (
                          <Collapse in={expandedSubCategory === subCategory.id} timeout="auto" unmountOnExit>
                            <List disablePadding>
                              {subCategory.productTypes.map((productType) => (
                                <ListItem key={productType.id} disablePadding>
                                  <Link 
                                    href={`/products/product-type/${productType.id}`} 
                                    style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}
                                  >
                                    <ProductTypeItem>
                                      <ListItemText 
                                        primary={productType.name}
                                        primaryTypographyProps={{
                                          fontSize: '0.875rem',
                                        }}
                                      />
                                    </ProductTypeItem>
                                  </Link>
                                </ListItem>
                              ))}
                            </List>
                          </Collapse>
                        )}
                      </Box>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>
      </Drawer>
    </>
  )
} 