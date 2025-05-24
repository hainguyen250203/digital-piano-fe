import { useDeleteFromWishlistByProduct } from '@/hooks/apis/wishlist'
import { QueryKey } from '@/models/QueryKey'
import { WishlistItemData } from '@/services/apis/wishlist'
import { formatCurrency } from '@/utils/format'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { alpha, Box, Button, Fade, IconButton, Typography, useTheme } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

interface FavoriteProductsListProps {
  favoriteProducts: WishlistItemData[]
  onClose: () => void
}

export default function FavoriteProductsList({ favoriteProducts, onClose }: FavoriteProductsListProps) {
  const router = useRouter()
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { mutate: deleteWishlist, isPending: isPendingDelete } = useDeleteFromWishlistByProduct({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.WISHLIST_LIST] })
    },
    onError: error => {
      toast.error(error.message || 'Đã xảy ra lỗi')
    }
  })

  if (favoriteProducts.length === 0) {
    return (
      <Fade in timeout={500}>
        <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' height='100%' p={3} textAlign='center'>
          <Box
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
          </Box>
          <Typography variant='h6' gutterBottom fontWeight='medium'>
            Danh sách yêu thích trống
          </Typography>
          <Typography variant='body2' color='text.secondary' paragraph>
            Bạn chưa thêm sản phẩm nào vào danh sách yêu thích
          </Typography>
          <Button
            variant='contained'
            onClick={() => router.push('/products')}
            sx={{
              'mt': 2,
              'px': 3,
              'py': 1,
              'borderRadius': 2,
              'boxShadow': 2,
              'transition': 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3
              }
            }}
          >
            Khám phá sản phẩm
          </Button>
        </Box>
      </Fade>
    )
  }

  return (
    <Fade in timeout={300}>
      <Box>
        <Typography
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' },
            color: '#000000',
            mb: 2
          }}
        >
          Bạn có {favoriteProducts.length} sản phẩm trong danh sách yêu thích.
        </Typography>
        {favoriteProducts.map((favoriteProduct: WishlistItemData) => (
          <Box
            key={favoriteProduct.id}
            sx={{
              'display': 'flex',
              'p': 2,
              'mb': 1,
              'borderRadius': 2,
              'bgcolor': '#ffffff',
              'position': 'relative',
              'transition': 'all 0.2s ease',
              'border': '1px solid',
              'borderColor': 'divider',
              '&:hover': {
                bgcolor: alpha(theme.palette.background.default, 0.7),
                borderColor: theme.palette.divider
              }
            }}
          >
            <Box
              sx={{
                borderRadius: 1,
                overflow: 'hidden',
                width: 70,
                height: 70,
                position: 'relative',
                flexShrink: 0,
                border: '1px solid rgba(0,0,0,0.07)'
              }}
            >
              <Image src={favoriteProduct.product.defaultImage?.url || ''} alt={favoriteProduct.product.name} fill style={{ objectFit: 'cover' }} sizes='70px' />
              {favoriteProduct.product.salePrice && favoriteProduct.product.salePrice < favoriteProduct.product.price && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bgcolor: theme.palette.error.main,
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    py: 0.3,
                    px: 0.5,
                    borderBottomRightRadius: 4
                  }}
                >
                  {Math.round(((favoriteProduct.product.price - favoriteProduct.product.salePrice) / favoriteProduct.product.price) * 100)}% OFF
                </Box>
              )}
            </Box>

            <Box sx={{ ml: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0, pr: 5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', minWidth: 0 }}>
                <Link href={`/products/${favoriteProduct.product.id}`} onClick={onClose} style={{ textDecoration: 'none', display: 'block' }}>
                  <Typography
                    variant='body1'
                    sx={{
                      'display': '-webkit-box',
                      'WebkitLineClamp': 2,
                      'WebkitBoxOrient': 'vertical',
                      'overflow': 'hidden',
                      'textOverflow': 'ellipsis',
                      'fontWeight': 500,
                      'color': 'text.primary',
                      'transition': 'color 0.2s',
                      'lineHeight': '1.3',
                      'maxHeight': '2.6em',
                      'wordBreak': 'break-word',
                      'width': '100%',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    {favoriteProduct.product.name}
                  </Typography>
                </Link>

                <Box mt={0.5}>
                  {favoriteProduct.product.salePrice ? (
                    <>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        component='span'
                        sx={{
                          textDecoration: 'line-through',
                          fontSize: '0.75rem',
                          mr: 1
                        }}
                      >
                        {formatCurrency(favoriteProduct.product.price)}
                      </Typography>
                      <Typography variant='body2' color='error' component='span' fontWeight='medium'>
                        {formatCurrency(favoriteProduct.product.salePrice)}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant='body2' color='text.primary' fontWeight='medium'>
                      {formatCurrency(favoriteProduct.product.price)}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box height={32} />
            </Box>

            <IconButton
              onClick={() => deleteWishlist(favoriteProduct.product.id)}
              disabled={isPendingDelete}
              size='small'
              sx={{
                'position': 'absolute',
                'top': 8,
                'right': 8,
                'p': 0.5,
                'color': 'text.secondary',
                '&:hover': {
                  color: theme.palette.error.main,
                  bgcolor: alpha(theme.palette.error.light, 0.1)
                }
              }}
            >
              <DeleteOutlineIcon fontSize='small' />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Fade>
  )
}
