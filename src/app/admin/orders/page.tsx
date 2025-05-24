'use client';

import OrderList from '@/components/admin/order/order-list';
import { useFetchGetAllOrders } from '@/hooks/apis/order';
import { Box, CircularProgress } from '@mui/material';

export default function OrdersPage() {
  const { data: orders, isLoading } = useFetchGetAllOrders();
  
  if (isLoading) {
    return (
      <Box 
        height='100vh' 
        width='100%' 
        display='flex' 
        justifyContent='center' 
        alignItems='center'
      >
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box height='100vh' width='100%' p={3}>
      <OrderList orders={orders?.data || []} />
    </Box>
  );
} 