'use client'

import { CategoryMenuData } from '@/hooks/apis/category'
import { Close, KeyboardArrowDown, Menu as MenuIcon } from '@mui/icons-material'
import { Box, Collapse, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, alpha, styled } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useMemo, useState } from 'react'

interface MobileMenuProps {
  categories: CategoryMenuData[]
}

const MenuHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText
}))

const ProductTypeItem = styled(ListItemButton)(({ theme }) => ({
  'paddingLeft': theme.spacing(6),
  'paddingRight': theme.spacing(2.5),
  'fontSize': '0.875rem',
  'color': theme.palette.text.secondary,
  'transition': 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    color: theme.palette.primary.main
  }
}))

// Styled component for the arrow button
const ArrowButton = styled(IconButton)(({ theme }) => ({
  'padding': theme.spacing(0.5),
  'marginLeft': theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08)
  }
}))

// Memoized Category component
const Category = memo(
  ({
    category,
    expandedCategory,
    handleCategoryExpand,
    toggleDrawer
  }: {
    category: CategoryMenuData
    expandedCategory: string | null
    handleCategoryExpand: (id: string, e: React.MouseEvent) => void
    toggleDrawer: () => void
  }) => {
    const isExpanded = expandedCategory === category.id

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: theme => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          backgroundColor: isExpanded ? theme => alpha(theme.palette.primary.main, 0.08) : 'transparent',
          borderLeft: isExpanded ? theme => `4px solid ${theme.palette.primary.main}` : 'none',
          pl: isExpanded ? 0 : 0.5
        }}
      >
        <Link
          href={`/products/category/${category.id}`}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            flex: 1,
            padding: '12px 20px'
          }}
          onClick={toggleDrawer}
        >
          <ListItemText
            primary={category.name}
            primaryTypographyProps={{
              fontWeight: isExpanded ? 700 : 600,
              color: isExpanded ? 'primary.main' : 'text.primary'
            }}
          />
        </Link>

        {category.subCategories.length > 0 && (
          <ArrowButton onClick={e => handleCategoryExpand(category.id, e)} size='small' sx={{ mr: 1 }}>
            <KeyboardArrowDown
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
                color: isExpanded ? 'primary.main' : 'text.secondary'
              }}
            />
          </ArrowButton>
        )}
      </Box>
    )
  }
)

Category.displayName = 'Category'

// Memoized SubCategory component
const SubCategory = memo(
  ({
    subCategory,
    expandedSubCategory,
    handleSubCategoryExpand,
    toggleDrawer
  }: {
    subCategory: CategoryMenuData['subCategories'][0]
    expandedSubCategory: string | null
    handleSubCategoryExpand: (id: string, e: React.MouseEvent) => void
    toggleDrawer: () => void
  }) => {
    const isExpanded = expandedSubCategory === subCategory.id

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme => alpha(theme.palette.background.default, 0.5),
          borderLeft: isExpanded ? theme => `4px solid ${alpha(theme.palette.primary.main, 0.5)}` : 'none',
          pl: isExpanded ? 0 : 0.5
        }}
      >
        <Link
          href={`/products/sub-category/${subCategory.id}`}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            flex: 1,
            padding: '8px 16px 8px 32px'
          }}
          onClick={toggleDrawer}
        >
          <ListItemText
            primary={subCategory.name}
            primaryTypographyProps={{
              fontWeight: isExpanded ? 700 : 500,
              fontSize: '0.95rem',
              color: isExpanded ? 'primary.main' : 'text.primary'
            }}
          />
        </Link>

        {subCategory.productTypes.length > 0 && (
          <ArrowButton onClick={e => handleSubCategoryExpand(subCategory.id, e)} size='small' sx={{ mr: 1 }}>
            <KeyboardArrowDown
              fontSize='small'
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
                color: isExpanded ? 'primary.main' : 'text.secondary'
              }}
            />
          </ArrowButton>
        )}
      </Box>
    )
  }
)

SubCategory.displayName = 'SubCategory'

// Memoized ProductType component
const ProductType = memo(({ productType, toggleDrawer }: { productType: CategoryMenuData['subCategories'][0]['productTypes'][0]; toggleDrawer: () => void }) => (
  <ListItem disablePadding>
    <Link href={`/products/product-type/${productType.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }} onClick={toggleDrawer}>
      <ProductTypeItem>
        <ListItemText
          primary={productType.name}
          primaryTypographyProps={{
            fontSize: '0.875rem'
          }}
        />
      </ProductTypeItem>
    </Link>
  </ListItem>
))

ProductType.displayName = 'ProductType'

export default function MobileMenu({ categories }: MobileMenuProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null)

  const toggleDrawer = useCallback(() => {
    setDrawerOpen(prev => !prev)
  }, [])

  const handleCategoryExpand = useCallback(
    (categoryId: string, event: React.MouseEvent) => {
      event.stopPropagation()
      setExpandedCategory(prev => (prev === categoryId ? null : categoryId))
      // Close any open subcategories when changing categories
      setExpandedSubCategory(prev => {
        const currentCategory = expandedCategory
        return currentCategory === categoryId ? prev : null
      })
    },
    [expandedCategory]
  )

  const handleSubCategoryExpand = useCallback((subCategoryId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setExpandedSubCategory(prev => (prev === subCategoryId ? null : subCategoryId))
  }, [])

  // Memoize the drawer styles
  const drawerStyles = useMemo(
    () => ({
      '& .MuiDrawer-paper': {
        width: '85%',
        maxWidth: 360,
        boxSizing: 'border-box',
        boxShadow: '0 0 20px rgba(0,0,0,0.1)'
      }
    }),
    []
  )

  // Memoize the hamburger button styles
  const hamburgerStyles = useMemo(
    () => ({
      'mr': 1,
      '&:hover': {
        transform: 'scale(1.05)'
      },
      'transition': 'transform 0.2s ease'
    }),
    []
  )

  // Memoize the close button styles
  const closeButtonStyles = useMemo(
    () => ({
      'color': 'white',
      '&:hover': {
        backgroundColor: alpha('#fff', 0.2)
      }
    }),
    []
  )

  // Memoize the list styles
  const listStyles = useMemo(
    () => ({
      pb: 8,
      overflowY: 'auto',
      height: 'calc(100% - 60px)'
    }),
    []
  )

  return (
    <>
      {/* Hamburger Menu Button */}
      <IconButton edge='start' color='inherit' aria-label='menu' onClick={toggleDrawer} sx={hamburgerStyles}>
        <MenuIcon />
      </IconButton>

      {/* Drawer Menu */}
      <Drawer anchor='left' open={drawerOpen} onClose={toggleDrawer} sx={drawerStyles}>
        {/* Menu Header with Logo */}
        <MenuHeader>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: 120,
              flex: 1,
              position: 'relative'
            }}
          >
            <Link href='/' onClick={toggleDrawer}>
              <Image
                src='/logo.png'
                alt='Logo'
                width={110}
                height={36}
                style={{
                  filter: 'brightness(0) invert(1)',
                  objectFit: 'contain'
                }}
                priority
              />
            </Link>
          </Box>
          <IconButton edge='end' onClick={toggleDrawer} sx={closeButtonStyles}>
            <Close />
          </IconButton>
        </MenuHeader>

        {/* Menu Items */}
        <List disablePadding sx={listStyles}>
          {categories.map(category => (
            <Box key={category.id}>
              {/* Category */}
              <Category category={category} expandedCategory={expandedCategory} handleCategoryExpand={handleCategoryExpand} toggleDrawer={toggleDrawer} />

              {/* Subcategories */}
              {category.subCategories.length > 0 && (
                <Collapse in={expandedCategory === category.id} timeout='auto' unmountOnExit>
                  <List disablePadding>
                    {category.subCategories.map(subCategory => (
                      <Box key={subCategory.id}>
                        {/* Subcategory */}
                        <SubCategory subCategory={subCategory} expandedSubCategory={expandedSubCategory} handleSubCategoryExpand={handleSubCategoryExpand} toggleDrawer={toggleDrawer} />

                        {/* Product Types */}
                        {subCategory.productTypes.length > 0 && (
                          <Collapse in={expandedSubCategory === subCategory.id} timeout='auto' unmountOnExit>
                            <List disablePadding>
                              {subCategory.productTypes.map(productType => (
                                <ProductType key={productType.id} productType={productType} toggleDrawer={toggleDrawer} />
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
