'use client'

import ProductDetailSkeleton from '@/components/Product/ProductDetailSkeleton'
import ProductItem from '@/components/Product/ProductItem'
import { useCartWishlist } from '@/context/CartWishlistContext'
import { ProductDetailData, useFetchProductDetail, useFetchProductRelated } from '@/hooks/apis/product'
import { DescriptionBlock } from '@/types/product.type'
import { formatCurrency } from '@/utils/format'
import { AddShoppingCart, CheckCircle, ExpandMore, Favorite, LocalShipping, NavigateNext } from '@mui/icons-material'
import { Box, Breadcrumbs, Button, Chip, CircularProgress, Divider, Grid, IconButton, Link, Paper, Stack, Typography, alpha, useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const productId = React.use(params).id

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { data: productData, isLoading, error } = useFetchProductDetail(productId)
  const { data: relatedProducts } = useFetchProductRelated(productId)
  
  const { 
    addToWishlist, 
    addToCart, 
    isAddingToWishlist, 
    isAddingToCart,
    isInWishlist
  } = useCartWishlist()
  
  const product = productData?.data
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isVideoSelected, setIsVideoSelected] = useState(false)
  const [descriptionBlocks, setDescriptionBlocks] = useState<DescriptionBlock[]>([])
  const [showDescription, setShowDescription] = useState(false)
  const isProductInWishlist = product ? isInWishlist(productId) : false
  const isProductAddingToCart = isAddingToCart(productId)
  const isProductAddingToWishlist = isAddingToWishlist(productId)

  // Refs for carousel scrolling
  const relatedProductsRef = useRef<HTMLDivElement>(null)

  // Parse description when product data changes
  useEffect(() => {
    if (product?.description) {
      try {
        // Try to parse as JSON
        const parsedBlocks = JSON.parse(product.description)
        if (Array.isArray(parsedBlocks)) {
          setDescriptionBlocks(parsedBlocks)
        } else {
          // If not an array, create a single paragraph block
          setDescriptionBlocks([{ type: 'paragraph', content: product.description }])
        }
      } catch {
        // If parsing fails, it's plain text
        setDescriptionBlocks([{ type: 'paragraph', content: product.description }])
      }
    }

    // Set video as selected by default if videoUrl exists
    if (product?.videoUrl) {
      setIsVideoSelected(true)
      setSelectedImage(null)
    } else if (product?.defaultImage?.url) {
      setIsVideoSelected(false)
      setSelectedImage(product.defaultImage.url)
    }
  }, [product])

  // Logic for handling images
  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setIsVideoSelected(false)
  }

  // Logic for handling video selection
  const handleVideoSelect = () => {
    setIsVideoSelected(true)
    setSelectedImage(null)
  }

  // Toggle description visibility
  const toggleDescription = () => {
    setShowDescription(prev => !prev)
  }

  function GetVideoId(url: string): string | null {
    //https://www.youtube.com/watch?v=R_9VRIwp1CY
    const match = url.match(/youtube\.com\/watch\?v=([^?]+)/)
    if (match) {
      return match[1]
    }
    return null
  }

  // Display loading state
  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  // Display error state
  if (error || !product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', flexDirection: 'column' }}>
        <Typography variant='h5' color='error' gutterBottom>
          Không thể tải thông tin sản phẩm
        </Typography>
        <Typography variant='body1'>Vui lòng thử lại sau</Typography>
      </Box>
    )
  }

  const displayImage = selectedImage || product.defaultImage?.url || '/placeholder-image.jpg'
  const isOutOfStock = !product.stock || product.stock.quantity === 0
  const discountPercentage = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : null

  // Render different description block types
  const renderDescriptionBlock = (block: DescriptionBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        return (
          <Typography key={index} variant='h6' fontWeight={600} sx={{ mt: 2, mb: 1 }}>
            {block.content}
          </Typography>
        )
      case 'paragraph':
        return (
          <Typography key={index} variant='body1' sx={{ mb: 2, lineHeight: 1.8 }}>
            {block.content}
          </Typography>
        )
      case 'specs':
        return (
          <Box key={index} sx={{ mb: 2 }}>
            <Box component='ul' sx={{ pl: 3 }}>
              {block.content.map((spec, i) => (
                <Typography component='li' key={i} variant='body2' sx={{ mb: 0.5 }}>
                  {spec}
                </Typography>
              ))}
            </Box>
          </Box>
        )
      case 'image':
        return (
          <Box key={index} sx={{ my: 2, position: 'relative', height: 300, borderRadius: 1, overflow: 'hidden' }}>
            <Image src={block.content.src} alt={block.content.alt} fill style={{ objectFit: 'contain' }} />
          </Box>
        )
      default:
        return null
    }
  }

  const handleAddToFavorites = () => {
    addToWishlist(productId)
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({ productId })
    }
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize='small' />} aria-label='breadcrumb' sx={{ mb: 2 }}>
        <Link href='/' style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography color='text.secondary'>Trang Chủ</Typography>
        </Link>
        <Link href='/products' style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography color='text.primary'>Sản Phẩm</Typography>
        </Link>
        <Typography color='text.primary'>{product.name}</Typography>
      </Breadcrumbs>
      <Grid container spacing={{ xs: 3, md: 4 }} direction={isMobile ? 'column' : 'row'}>
        {/* product images - right side on desktop, top on mobile */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            {/* Main Image or Video */}
            <Paper
              elevation={2}
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 300, sm: 400, md: 500 },
                borderRadius: 2,
                overflow: 'hidden',
                mb: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              {isVideoSelected && product.videoUrl ? (
                <Box sx={{ width: '100%', height: '100%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${GetVideoId(product.videoUrl)}`}
                    title={`${product.name} - Video`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  />
                </Box>
              ) : (
                <Image
                  src={displayImage}
                  alt={product.name}
                  fill
                  priority
                  sizes='(max-width: 768px) 100vw, 50vw'
                  style={{
                    objectFit: 'contain',
                    backgroundColor: '#ffffff',
                    padding: '1rem'
                  }}
                />
              )}
            </Paper>

            {/* Thumbnail Images */}
            <Box
              sx={{
                'display': 'flex',
                'gap': 2,
                'overflowX': 'auto',
                'pb': 1,
                'pt': 1,
                'px': 0.5,
                'scrollSnapType': 'x mandatory', // Add snap scrolling for better UX
                'WebkitOverflowScrolling': 'touch', // Improve mobile scrolling
                'scrollbarWidth': 'thin',
                'msOverflowStyle': 'none',
                'position': 'relative',
                '&::after': {
                  // Add shadow indicator to show more content is available
                  content: '""',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: '30px',
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8))',
                  pointerEvents: 'none',
                  display: { xs: 'block', md: 'none' }
                },
                '&::-webkit-scrollbar': {
                  height: { xs: 4, md: 6 } // Smaller on mobile for less intrusion
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: 3
                },
                '&::-webkit-scrollbar-thumb': {
                  'bgcolor': 'rgba(0, 0, 0, 0.2)',
                  'borderRadius': 3,
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.3)'
                  }
                }
              }}
            >
              {/* YouTube Video thumbnail */}
              {product.videoUrl && (
                <Box
                  sx={{
                    width: { xs: 70, sm: 80 }, // Slightly smaller on very small screens
                    height: { xs: 70, sm: 80 },
                    minWidth: { xs: 70, sm: 80 }, // Prevent thumbnail shrinking
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    border: isVideoSelected ? `2px solid ${theme.palette.error.main}` : '2px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `url(${`https://img.youtube.com/vi/${GetVideoId(product.videoUrl)}/hqdefault.jpg`})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 1,
                    scrollSnapAlign: 'start', // Add snap point
                    flexShrink: 0 // Prevent thumbnail shrinking
                  }}
                  onClick={handleVideoSelect}
                >
                  <Box
                    sx={{
                      width: { xs: 24, sm: 30 },
                      height: { xs: 24, sm: 30 },
                      bgcolor: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}
                  >
                    <Box
                      sx={{
                        width: 0,
                        height: 0,
                        borderTop: { xs: '5px solid transparent', sm: '6px solid transparent' },
                        borderBottom: { xs: '5px solid transparent', sm: '6px solid transparent' },
                        borderLeft: { xs: '8px solid #f44336', sm: '10px solid #f44336' },
                        ml: 0.5
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Default image thumbnail */}
              {product.defaultImage && (
                <Box
                  onClick={() => handleImageSelect(product.defaultImage!.url)}
                  sx={{
                    width: { xs: 70, sm: 80 },
                    height: { xs: 70, sm: 80 },
                    minWidth: { xs: 70, sm: 80 },
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    border: theme =>
                      !isVideoSelected && (selectedImage === product.defaultImage!.url || (!selectedImage && product.defaultImage))
                        ? `2px solid ${theme.palette.primary.main}`
                        : '2px solid transparent',
                    borderRadius: 1,
                    scrollSnapAlign: 'start',
                    flexShrink: 0
                  }}
                >
                  <Image src={product.defaultImage.url} alt={`${product.name} - thumbnail`} fill sizes='80px' style={{ objectFit: 'contain', padding: '0.5rem', backgroundColor: '#ffffff' }} />
                </Box>
              )}

              {/* Additional images thumbnails */}
              {product.images?.map((image, index) => {
                if (image.id === product.defaultImage?.id) return null
                return (
                  <Box
                    key={image.id}
                    onClick={() => handleImageSelect(image.url)}
                    sx={{
                      width: { xs: 70, sm: 80 },
                      height: { xs: 70, sm: 80 },
                      minWidth: { xs: 70, sm: 80 },
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer',
                      border: theme => (!isVideoSelected && selectedImage === image.url ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent'),
                      borderRadius: 1,
                      scrollSnapAlign: 'start',
                      flexShrink: 0
                    }}
                  >
                    <Image src={image.url} alt={`${product.name} - thumbnail ${index + 1}`} fill sizes='80px' style={{ objectFit: 'contain', padding: '0.5rem', backgroundColor: '#ffffff' }} />
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Grid>
        {/* product information - left side on desktop, bottom on mobile */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            {/* Product Categories */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip
                label={product.category.name}
                size='small'
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 500
                }}
              />
              <Chip
                label={product.subCategory.name}
                size='small'
                sx={{
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                  fontWeight: 500
                }}
              />
              {product.productType && (
                <Chip
                  label={product.productType.name}
                  size='small'
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
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
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
              }}
            >
              {product.name}
            </Typography>

            {/* Brand */}
            <Typography variant='body1' color='text.secondary' sx={{ mb: 2 }}>
              Thương hiệu: <span style={{ fontWeight: 600 }}>{product.brand.name}</span>
            </Typography>

            {/* Tags */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {product.isHotSale && <Chip label='Khuyến Mãi' size='small' color='error' sx={{ fontWeight: 600 }} />}
              {product.isFeatured && <Chip label='Nổi Bật' size='small' color='primary' sx={{ fontWeight: 600 }} />}
              {discountPercentage && <Chip label={`-${discountPercentage}%`} size='small' color='error' sx={{ fontWeight: 600 }} />}
            </Box>

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              {product.salePrice ? (
                <Box display='flex' alignItems='center' gap={1}>
                  <Typography variant='h5' color='error' fontWeight='bold'>
                    {formatCurrency(product.salePrice)}
                  </Typography>
                  <Typography variant='h6' color='text.secondary' sx={{ textDecoration: 'line-through' }}>
                    {formatCurrency(product.price)}
                  </Typography>
                </Box>
              ) : (
                <Typography variant='h5' fontWeight='bold'>
                  {formatCurrency(product.price)}
                </Typography>
              )}
            </Box>

            {/* Stock status */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                color: isOutOfStock ? 'error.main' : 'success.main',
                fontWeight: 500
              }}
            >
              {isOutOfStock ? (
                <>
                  <Typography variant='body1' fontWeight={600} color='error'>
                    Hết hàng
                  </Typography>
                </>
              ) : (
                <>
                  <CheckCircle fontSize='small' />
                  <Typography variant='body1' fontWeight={600} color='success.main'>
                    Còn hàng ({product.stock?.quantity})
                  </Typography>
                </>
              )}
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3 }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              <Button
                variant='contained'
                color='primary'
                size='large'
                startIcon={isProductAddingToCart ? <CircularProgress size={20} color='inherit' /> : <AddShoppingCart />}
                disabled={isOutOfStock || isProductAddingToCart}
                onClick={handleAddToCart}
                sx={{
                  'flex': { xs: '1 1 100%', sm: '1 1 auto' },
                  'borderRadius': 2,
                  'py': 1.5,
                  'px': 3,
                  'fontWeight': 'bold',
                  'boxShadow': 2,
                  'textTransform': 'none',
                  'fontSize': '1rem',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)'
                  },
                  'transition': 'transform 0.2s',
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
                onClick={handleAddToFavorites}
                sx={{
                  'flex': { xs: '1 1 100%', sm: '0 0 auto' },
                  'borderRadius': 2,
                  'py': 1.5,
                  'fontWeight': 'medium',
                  'borderWidth': '2px',
                  'textTransform': 'none',
                  ...(isProductInWishlist && {
                    bgcolor: alpha(theme.palette.error.main, 0.1)
                  }),
                  '&:hover': {
                    borderWidth: '2px'
                  }
                }}
              >
                {isProductInWishlist ? 'Đã Yêu Thích' : isProductAddingToWishlist ? 'Đang thêm...' : 'Thêm Vào Yêu Thích'}
              </Button>
            </Box>

            {/* Shipping Info */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mt: 3,
                bgcolor: theme => alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2
              }}
            >
              <Stack direction='row' spacing={2} alignItems='center'>
                <LocalShipping color='primary' />
                <Typography variant='body2'>Giao hàng miễn phí cho mọi đơn hàng</Typography>
              </Stack>
            </Paper>

            {/* Description with toggle */}
            <Box sx={{ mt: 4 }}>
              <Box
                sx={{
                  'display': 'flex',
                  'alignItems': 'center',
                  'justifyContent': 'space-between',
                  'mb': 2,
                  'cursor': 'pointer',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
                onClick={toggleDescription}
              >
                <Typography variant='h6' fontWeight={600}>
                  Mô tả sản phẩm
                </Typography>
                <IconButton
                  size='small'
                  color='primary'
                  sx={{
                    transition: 'transform 0.3s ease',
                    transform: showDescription ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                >
                  <ExpandMore />
                </IconButton>
              </Box>

              {showDescription && (
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                  {descriptionBlocks.length > 0 ? (
                    descriptionBlocks.map((block, index) => renderDescriptionBlock(block, index))
                  ) : (
                    <Typography variant='body1'>{product.description || 'Không có thông tin mô tả.'}</Typography>
                  )}
                </Paper>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Related Products Section with Carousel */}
      {relatedProducts?.length > 0 && (
        <Box sx={{ mt: 10, position: 'relative' }}>
          {/* Header with title and navigation */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant='h5' fontWeight={700} color='primary.main'>
              Sản phẩm liên quan
            </Typography>
          </Box>

          {/* Product Carousel */}
          <Box
            ref={relatedProductsRef}
            sx={{
              'display': 'flex',
              'overflowX': 'auto',
              'gap': 3,
              'py': 2,
              'scrollBehavior': 'smooth',
              'scrollSnapType': 'x mandatory',
              'px': { xs: 1, sm: 0 },
              '&::-webkit-scrollbar': {
                height: 8
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: 4
              },
              '&::-webkit-scrollbar-thumb': {
                'bgcolor': alpha(theme.palette.primary.main, 0.6),
                'borderRadius': 4,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.8)
                }
              },
              'scrollbarWidth': 'thin',
              'msOverflowStyle': 'none'
            }}
          >
            {relatedProducts.map((product: ProductDetailData) => (
              <Box
                key={product.id}
                sx={{
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  width: {
                    xs: '80%',
                    sm: 'calc(50% - 16px)',
                    md: 'calc(33.333% - 16px)',
                    lg: 'calc(25% - 16px)'
                  }
                }}
              >
                <ProductItem product={product} />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
