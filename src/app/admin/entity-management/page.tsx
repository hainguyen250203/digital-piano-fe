'use client'

import BrandList from '@/components/admin/brand/brand-list'
import CategoryList from '@/components/admin/category/category-list'
import ProductTypeList from '@/components/admin/product-type/product-type-list'
import SubCategoryList from '@/components/admin/subcategory/subcategory-list'
import SupplierList from '@/components/admin/supplier/supplier-list'
import { Box, Tab, Tabs } from '@mui/material'
import { SyntheticEvent, useState } from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} id={`entity-tabpanel-${index}`} aria-labelledby={`entity-tab-${index}`} {...other} style={{ width: '100%' }}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    'id': `entity-tab-${index}`,
    'aria-controls': `entity-tabpanel-${index}`
  }
}

export default function EntityManagementPage() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box height='100vh' width='100%'>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label='entity management tabs' variant='scrollable' scrollButtons='auto'>
          <Tab label='Danh mục' {...a11yProps(0)} />
          <Tab label='Danh mục con' {...a11yProps(1)} />
          <Tab label='Loại sản phẩm' {...a11yProps(2)} />
          <Tab label='Thương hiệu' {...a11yProps(3)} />
          <Tab label='Nhà cung cấp' {...a11yProps(4)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <CategoryList />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <SubCategoryList />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ProductTypeList />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <BrandList />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <SupplierList />
      </TabPanel>
    </Box>
  )
}
