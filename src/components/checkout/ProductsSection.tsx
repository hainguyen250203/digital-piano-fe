import { CartItemType } from '@/types/cart.type'
import { formatCurrency } from '@/utils/format'
import { Box, Button, Card, CardContent, Divider, Typography } from '@mui/material'
import Image from 'next/image'

interface ProductsSectionProps {
  items: CartItemType[]
}

export default function ProductsSection({ items }: ProductsSectionProps) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Sản Phẩm
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color='text.secondary'>Giỏ hàng của bạn đang trống</Typography>
            <Button variant='contained' sx={{ mt: 2 }} href='/products'>
              Tiếp Tục Mua Sắm
            </Button>
          </Box>
        ) : (
          items.map(item => (
            <Box key={item.id} sx={{ display: 'flex', mb: 2, py: 1 }}>
              <Box>
                <Image src={item.product.defaultImage?.url || 'https://www.aaronfaber.com/wp-content/uploads/2017/03/product-placeholder-wp.jpg'} alt={item.product.name} width={80} height={80} />
              </Box>
              <Box sx={{ flex: 1, ml: 2 }}>
                <Typography variant='body1' fontWeight='bold'>
                  {item.product.name}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Số lượng: {item.quantity}
                </Typography>
                <Typography variant='body1'>{item.product.salePrice ? formatCurrency(item.product.salePrice * item.quantity) : formatCurrency(item.product.price * item.quantity)}</Typography>
              </Box>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  )
}
