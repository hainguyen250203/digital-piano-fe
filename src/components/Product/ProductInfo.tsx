import { ProductDetailData } from '@/hooks/apis/product'
import { formatCurrency } from '@/utils/format'
import { AddShoppingCart, Favorite, LocalShipping, SwapHoriz } from '@mui/icons-material'
import { Box, Button, Chip, CircularProgress, Divider, Paper, Stack, Typography, alpha } from '@mui/material'

interface ProductInfoProps {
  product: ProductDetailData
  isProductInWishlist: boolean
  isProductAddingToCart: boolean
  isProductAddingToWishlist: boolean
  onAddToCart: () => void
  onAddToWishlist: () => void
}

export default function ProductInfo({ product, isProductInWishlist, isProductAddingToCart, isProductAddingToWishlist, onAddToCart, onAddToWishlist }: ProductInfoProps) {
  const isOutOfStock = !product.stock || product.stock.quantity === 0
  const discountPercentage = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : null

  return (
    <Box>
      {/* Product Categories */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label={product.category.name}
          size='small'
          sx={{
            bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            fontWeight: 500
          }}
        />
        <Chip
          label={product.subCategory.name}
          size='small'
          sx={{
            bgcolor: theme => alpha(theme.palette.secondary.main, 0.1),
            color: 'secondary.main',
            fontWeight: 500
          }}
        />
        {product.productType && (
          <Chip
            label={product.productType.name}
            size='small'
            sx={{
              bgcolor: theme => alpha(theme.palette.info.main, 0.1),
              color: 'info.main',
              fontWeight: 500
            }}
          />
        )}
      </Box>

      {/* Product Name */}
      <Typography
        variant='h4'
        component='h1'
        sx={{
          fontWeight: 700,
          mb: 2,
          color: 'text.primary'
        }}
      >
        {product.name}
      </Typography>

      {/* Brand */}
      <Typography variant='subtitle1' color='text.secondary' sx={{ mb: 2 }}>
        Thương hiệu: <span style={{ fontWeight: 600 }}>{product.brand.name}</span>
      </Typography>

      {/* Tags */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {product.isHotSale && <Chip label='Khuyến Mãi' size='small' color='error' sx={{ fontWeight: 600 }} />}
        {product.isFeatured && <Chip label='Nổi Bật' size='small' color='primary' sx={{ fontWeight: 600 }} />}
        {discountPercentage && <Chip label={`-${discountPercentage}%`} size='small' color='error' sx={{ fontWeight: 600 }} />}
      </Box>

      {/* Price Box */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {product.salePrice ? (
          <Box>
            <Typography variant='body2' color='text.secondary'>
              Giá gốc:{' '}
              <Typography component='span' variant='body2' sx={{ textDecoration: 'line-through' }}>
                {formatCurrency(product.price)}
              </Typography>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant='h5' color='error' fontWeight='bold'>
                {formatCurrency(product.salePrice)}
              </Typography>
              {discountPercentage && <Chip label={`Tiết kiệm ${discountPercentage}%`} size='small' color='error' sx={{ fontWeight: 600, fontSize: '0.75rem' }} />}
            </Box>
          </Box>
        ) : (
          <Typography variant='h5' fontWeight='bold'>
            {formatCurrency(product.price)}
          </Typography>
        )}
      </Paper>

      {/* Stock status */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 3
        }}
      >
        {isOutOfStock ? (
          <>
            <Typography variant='subtitle1' fontWeight={600} color='error' sx={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 5, backgroundColor: '#f44336', marginRight: 8 }}></span>
              Hết hàng
            </Typography>
          </>
        ) : (
          <>
            <Typography variant='subtitle1' fontWeight={600} color='success.main' sx={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 5, backgroundColor: '#4caf50', marginRight: 8 }}></span>
              Còn hàng ({product.stock?.quantity})
            </Typography>
          </>
        )}
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 3 }} />

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant='contained'
          color='primary'
          size='large'
          startIcon={isProductAddingToCart ? <CircularProgress size={20} color='inherit' /> : <AddShoppingCart />}
          disabled={isOutOfStock || isProductAddingToCart}
          onClick={onAddToCart}
          sx={{
            'flex': { xs: '1 1 100%', sm: '1 1 auto' },
            'borderRadius': 10,
            'py': 1.5,
            'px': 3,
            'fontWeight': 'bold',
            'boxShadow': 2,
            'textTransform': 'none',
            '&:hover': {
              boxShadow: 3
            },
            ...(isOutOfStock && {
              bgcolor: 'action.disabledBackground',
              color: 'text.disabled'
            })
          }}
        >
          {isOutOfStock ? 'Hết Hàng' : isProductAddingToCart ? 'Đang thêm...' : 'Thêm Vào Giỏ Hàng'}
        </Button>

        <Button
          variant='outlined'
          color={isProductInWishlist ? 'error' : 'primary'}
          size='large'
          startIcon={isProductAddingToWishlist ? <CircularProgress size={20} color='inherit' /> : <Favorite />}
          disabled={isProductAddingToWishlist}
          onClick={onAddToWishlist}
          sx={{
            flex: { xs: '1 1 100%', sm: '0 0 auto' },
            borderRadius: 10,
            py: 1.5,
            fontWeight: 'medium',
            borderWidth: '1px',
            textTransform: 'none',
            ...(isProductInWishlist && {
              bgcolor: theme => alpha(theme.palette.error.main, 0.1)
            })
          }}
        >
          {isProductInWishlist ? 'Đã Yêu Thích' : isProductAddingToWishlist ? 'Đang thêm...' : 'Thêm Vào Yêu Thích'}
        </Button>
      </Box>

      {/* Shipping & Benefits Cards */}
      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: theme => alpha(theme.palette.success.main, 0.05),
              borderRadius: 2,
              flex: 1,
              border: '1px solid',
              borderColor: theme => alpha(theme.palette.success.main, 0.2)
            }}
          >
            <Stack direction='row' spacing={2} alignItems='center'>
              <LocalShipping color='success' />
              <Typography variant='body2'>Giao hàng miễn phí toàn quốc</Typography>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: theme => alpha(theme.palette.info.main, 0.05),
              borderRadius: 2,
              flex: 1,
              border: '1px solid',
              borderColor: theme => alpha(theme.palette.info.main, 0.2)
            }}
          >
            <Stack direction='row' spacing={2} alignItems='center'>
              <SwapHoriz color='info' />
              <Typography variant='body2'>Đổi trả trong vòng 7 ngày</Typography>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
