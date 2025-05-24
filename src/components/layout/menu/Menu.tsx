'use client'

import DesktopMenu from '@/components/layout/menu/DesktopMenu'
import MenuSkeleton from '@/components/layout/menu/MenuSkeleton'
import MobileMenu from '@/components/layout/menu/MobileMenu'
import { CategoryMenuData } from '@/hooks/apis/category'
import { useMediaQuery, useTheme } from '@mui/material'

interface MenuProps {
  categories: CategoryMenuData[]
  isLoading?: boolean
}

export default function Menu({ categories, isLoading = false }: MenuProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (isLoading) {
    return <MenuSkeleton />
  }

  return <>{isMobile ? <MobileMenu categories={categories} /> : <DesktopMenu categories={categories} />}</>
}
