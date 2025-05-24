"use client";

import ProductList from "@/components/admin/product/product-list";
import { useFetchProductList } from "@/hooks/apis/product";
import { Box, CircularProgress } from "@mui/material";

export default function ProductsPage() {
  const { data: products, isLoading } = useFetchProductList();
  
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
    <Box height='100vh' width='100%'>
      <ProductList products={products?.data} />
    </Box>
  );
}
