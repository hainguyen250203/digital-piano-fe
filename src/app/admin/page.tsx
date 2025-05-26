'use client'

import DashboardOverview from '@/components/admin/dashboard/DashboardOverview'
import ProductStatistics from '@/components/admin/dashboard/ProductStatistics'
import RevenueStatistics from '@/components/admin/dashboard/RevenueStatistics'
import SalesStatistics from '@/components/admin/dashboard/SalesStatistics'
import StockStatistics from '@/components/admin/dashboard/StockStatistics'
import { Box, Paper, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} id={`dashboard-tabpanel-${index}`} aria-labelledby={`dashboard-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Bảng Điều Khiển
      </Typography>

      {/* Dashboard Overview */}
      <DashboardOverview />

      {/* Tab Navigation */}
      <Paper sx={{ width: '100%', mb: 4, mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} indicatorColor='primary' textColor='primary' variant='scrollable' scrollButtons='auto'>
          <Tab label='Bán Hàng' />
          <Tab label='Sản Phẩm' />
          <Tab label='Doanh Thu' />
          <Tab label='Kho Hàng' />
        </Tabs>

        {/* Sales Tab */}
        <TabPanel value={tabValue} index={0}>
          <SalesStatistics />
        </TabPanel>

        {/* Products Tab */}
        <TabPanel value={tabValue} index={1}>
          <ProductStatistics />
        </TabPanel>

        {/* Revenue Tab */}
        <TabPanel value={tabValue} index={2}>
          <RevenueStatistics />
        </TabPanel>

        {/* Inventory Tab */}
        <TabPanel value={tabValue} index={3}>
          <StockStatistics />
        </TabPanel>
      </Paper>
    </Box>
  )
}
