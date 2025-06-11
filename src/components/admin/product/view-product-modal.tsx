import { ProductDetailData } from '@/types/product.type'
import { formatCurrency } from '@/utils/format'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, Button, Chip, CircularProgress, Divider, Fade, Grid, IconButton, Modal, Paper, Skeleton, Tooltip, Typography } from '@mui/material'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export interface ViewProductModalProps {
  open: boolean
  onClose: () => void
  product: ProductDetailData | null
}

export default function ViewProductModal({ open, onClose, product }: ViewProductModalProps) {
  const [description, setDescription] = useState<Array<{ type: string; content: string | string[] | { src: string; alt: string } }>>([])
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>([])
  const [defaultImagePreview, setDefaultImagePreview] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // Initialize data with product details when it changes
  useEffect(() => {
    if (product) {
      setIsLoading(true)

      // Parse description if it's a string
      const descriptionData = typeof product.description === 'string' ? JSON.parse(product.description) : product.description || []

      setDescription(descriptionData)

      // Handle images
      if (product.images) {
        setExistingImages(product.images)
      }

      // Set default image if exists
      if (product.defaultImage) {
        setDefaultImagePreview(product.defaultImage.url)
        setSelectedImage(product.defaultImage.url)
      } else if (product.images && product.images.length > 0) {
        setDefaultImagePreview(product.images[0].url)
        setSelectedImage(product.images[0].url)
      }

      // Simulate loading of data
      setTimeout(() => setIsLoading(false), 300)
    }
  }, [product])

  if (!product) return null

  const handleImageClick = (url: string) => {
    setSelectedImage(url)
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby='modal-product-details' closeAfterTransition>
      <Fade in={open}>
        <Box
          position='absolute'
          top='50%'
          left='50%'
          style={{
            transform: 'translate(-50%, -50%)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
          width={{ xs: '95%', sm: '90%', md: '80%', lg: '75%' }}
          bgcolor='background.paper'
          boxShadow={24}
          p={{ xs: 2, sm: 3, md: 4 }}
          borderRadius={2}
          sx={{
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555'
            }
          }}
        >
          {/* Close Button */}
          <IconButton
            aria-label='close'
            onClick={onClose}
            color='default'
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              color: '#9e9e9e' // Equivalent to grey.500
            }}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box display='flex' alignItems='center' mb={3} pr={5}>
            <VisibilityIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant='h5' fontWeight='bold' color='primary'>
              {isLoading ? <Skeleton width={200} /> : product.name}
            </Typography>
          </Box>

          {isLoading ? (
            <Box display='flex' justifyContent='center' alignItems='center' height='50vh'>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Product Images and Basic Info */}
              <Grid container spacing={3} mb={3}>
                {/* Product Images */}
                <Grid size={5}>
                  <Paper elevation={2} style={{ padding: 16, height: '100%', borderRadius: 8 }}>
                    {/* Main Image */}
                    <Box
                      position='relative'
                      width='100%'
                      height={350}
                      borderRadius={1}
                      mb={2}
                      style={{
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease'
                      }}
                      sx={{
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                    >
                      <Image
                        src={selectedImage || defaultImagePreview}
                        alt={product.name}
                        fill
                        unoptimized
                        style={{
                          objectFit: 'contain'
                        }}
                      />
                    </Box>

                    {/* Thumbnail Images */}
                    <Box display='flex' flexWrap='wrap' gap={1} justifyContent='center' mt={2}>
                      {existingImages.map((image, index) => (
                        <Tooltip title={image.id === product.defaultImage?.id ? 'Ảnh mặc định' : `Ảnh ${index + 1}`} key={index}>
                          <Box
                            onClick={() => handleImageClick(image.url)}
                            position='relative'
                            width={70}
                            height={70}
                            borderRadius={1}
                            style={{
                              overflow: 'hidden',
                              border: selectedImage === image.url ? '2px solid #4caf50' : image.id === product.defaultImage?.id ? '2px solid #ff9800' : '1px solid #e0e0e0',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            sx={{
                              '&:hover': {
                                borderColor: '#4caf50',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            <Image
                              src={image.url}
                              alt={`Ảnh sản phẩm ${index + 1}`}
                              fill
                              unoptimized
                              style={{
                                objectFit: 'cover'
                              }}
                            />
                          </Box>
                        </Tooltip>
                      ))}
                    </Box>
                  </Paper>
                </Grid>

                {/* Basic Information */}
                <Grid size={7}>
                  <Paper elevation={2} style={{ padding: 16, height: '100%', borderRadius: 8 }}>
                    <Typography variant='h6' mb={2} fontWeight='bold' color='primary.main' pb={1} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      Thông tin cơ bản
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <Typography variant='subtitle1' fontWeight='bold' color='text.secondary'>
                          Tên sản phẩm
                        </Typography>
                        <Typography variant='body1' fontSize='1.1rem'>
                          {product.name}
                        </Typography>
                      </Grid>

                      <Grid size={6}>
                        <Typography variant='subtitle1' fontWeight='bold' color='text.secondary'>
                          Giá
                        </Typography>
                        <Typography variant='body1' fontSize='1.1rem' color='success.main' fontWeight='bold'>
                          {formatCurrency(product.price)}
                        </Typography>
                      </Grid>

                      <Grid size={6}>
                        <Typography variant='subtitle1' fontWeight='bold' color='text.secondary'>
                          Giá khuyến mãi
                        </Typography>
                        {product.salePrice ? (
                          <Box display='flex' alignItems='center' gap={1}>
                            <Typography variant='body1' component='span' fontSize='1.1rem' color='error.main' fontWeight='bold'>
                              {formatCurrency(product.salePrice)}
                            </Typography>
                            <Typography variant='body2' component='span' color='text.disabled' style={{ textDecoration: 'line-through' }}>
                              {formatCurrency(product.price)}
                            </Typography>
                            {product.price > 0 && product.salePrice > 0 && (
                              <Box>
                                <Chip label={`Tiết kiệm ${Math.round((1 - product.salePrice / product.price) * 100)}%`} color='error' size='small' />
                              </Box>
                            )}
                          </Box>
                        ) : (
                          <Typography variant='body1' component='span'>
                            N/A
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={12} mt={1}>
                        <Divider />
                      </Grid>

                      <Grid size={4}>
                        <Typography variant='subtitle1' fontWeight='bold' color='text.secondary'>
                          Loại sản phẩm
                        </Typography>
                        <Typography variant='body1' component='span'>
                          {product.subCategory.name}
                        </Typography>
                      </Grid>

                      <Grid size={4}>
                        <Typography variant='subtitle1' fontWeight='bold' color='text.secondary'>
                          Loại sản phẩm
                        </Typography>
                        <Typography variant='body1' component='span'>
                          {product.productType?.name || 'N/A'}
                        </Typography>
                      </Grid>

                      <Grid size={4}>
                        <Typography variant='subtitle1' fontWeight='bold' color='text.secondary'>
                          Nhãn hàng
                        </Typography>
                        <Typography variant='body1' component='span'>
                          {product.brand.name}
                        </Typography>
                      </Grid>

                      <Grid size={12} mt={1}>
                        <Divider />
                      </Grid>

                      <Grid size={12}>
                        <Box display='flex' flexWrap='wrap' gap={2} mt={1}>
                          <Box>
                            <Typography variant='subtitle1' fontWeight='bold' color='text.secondary'>
                              Nổi bật
                            </Typography>
                            <Box>
                              <Chip
                                label={product.isFeatured ? 'Có' : 'Không'}
                                color={product.isFeatured ? 'warning' : 'default'}
                                size='small'
                                variant={product.isFeatured ? 'filled' : 'outlined'}
                                sx={{ minWidth: 70 }}
                              />
                            </Box>
                          </Box>

                          <Box>
                            <Typography variant='subtitle1' fontWeight='bold' color='text.secondary'>
                              Bán chạy
                            </Typography>
                            <Box>
                              <Chip
                                label={product.isHotSale ? 'Có' : 'Không'}
                                color={product.isHotSale ? 'error' : 'default'}
                                size='small'
                                variant={product.isHotSale ? 'filled' : 'outlined'}
                                sx={{ minWidth: 70 }}
                              />
                            </Box>
                          </Box>

                          <Box>
                            <Typography variant='subtitle1' fontWeight='bold' color='text.secondary'>
                              Trạng thái
                            </Typography>
                            <Box>
                              <Chip label={product.isDeleted ? 'Đã xóa' : 'Hoạt động'} color={product.isDeleted ? 'error' : 'success'} size='small' variant='filled' sx={{ minWidth: 70 }} />
                            </Box>
                          </Box>
                        </Box>
                      </Grid>

                      {product.stock && (
                        <>
                          <Grid size={12} mt={1}>
                            <Divider />
                          </Grid>

                          <Grid size={12}>
                            <Typography variant='subtitle1' fontWeight='bold' color='text.secondary'>
                              Số lượng hàng
                            </Typography>
                            <Box mt={1}>
                              <Chip label={product.stock.quantity} color={product.stock.quantity > 10 ? 'success' : product.stock.quantity > 0 ? 'warning' : 'error'} size='small' />
                            </Box>
                          </Grid>
                        </>
                      )}

                      {product.videoUrl && (
                        <>
                          <Grid size={12} mt={1}>
                            <Divider />
                          </Grid>

                          <Grid size={12}>
                            <Typography variant='subtitle1' fontWeight='bold' color='text.secondary'>
                              URL video
                            </Typography>
                            <Typography variant='body1' style={{ wordBreak: 'break-word' }}>
                              <a href={product.videoUrl} target='_blank' rel='noopener noreferrer'>
                                {product.videoUrl}
                              </a>
                            </Typography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>

              {/* Product Description */}
              {description.length > 0 && (
                <Paper
                  elevation={2}
                  style={{
                    padding: 24,
                    marginBottom: 24,
                    borderRadius: 8
                  }}
                >
                  <Typography variant='h6' mb={3} fontWeight='bold' color='primary.main' pb={1} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    Mô tả sản phẩm
                  </Typography>

                  <Box>
                    {description.map((item, index) => (
                      <Box key={index} mb={3}>
                        {item.type === 'heading' && (
                          <Typography variant='h6' fontWeight='bold' color='text.primary' gutterBottom>
                            {item.content as string}
                          </Typography>
                        )}

                        {item.type === 'paragraph' && (
                          <Typography
                            variant='body1'
                            style={{
                              whiteSpace: 'pre-line',
                              lineHeight: 1.7
                            }}
                            color='text.secondary'
                          >
                            {item.content as string}
                          </Typography>
                        )}

                        {item.type === 'specs' && (
                          <Box p={2} style={{ background: '#f9f9f9' }}>
                            <Typography variant='subtitle1' fontWeight='bold' mb={1} color='primary.main'>
                              Thông số kỹ thuật
                            </Typography>
                            <Box component='ul' pl={2} mb={0}>
                              {(item.content as string[]).map((spec, i) => (
                                <Box component='li' key={i} mb={0.7}>
                                  <Typography variant='body2'>{spec}</Typography>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        )}

                        {item.type === 'image' && (item.content as { src: string; alt: string }).src && (
                          <Box my={3}>
                            <Paper
                              elevation={1}
                              style={{
                                padding: 16,
                                display: 'inline-block',
                                borderRadius: 8
                              }}
                            >
                              <Image
                                src={(item.content as { src: string; alt: string }).src}
                                alt={(item.content as { src: string; alt: string }).alt || 'Product image'}
                                width={500}
                                height={350}
                                unoptimized
                                style={{
                                  maxWidth: '100%',
                                  height: 'auto',
                                  objectFit: 'contain'
                                }}
                              />
                              {(item.content as { src: string; alt: string }).alt && (
                                <Typography variant='caption' display='block' mt={1} color='text.secondary'>
                                  {(item.content as { src: string; alt: string }).alt}
                                </Typography>
                              )}
                            </Paper>
                          </Box>
                        )}

                        {index < description.length - 1 && <Divider style={{ margin: '24px 0' }} />}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              )}

              <Box display='flex' justifyContent='center' mt={3}>
                <Button
                  variant='contained'
                  onClick={onClose}
                  size='large'
                  style={{
                    minWidth: 150,
                    padding: '9.6px 0',
                    borderRadius: 8,
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  sx={{
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 10px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  Đóng
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  )
}
