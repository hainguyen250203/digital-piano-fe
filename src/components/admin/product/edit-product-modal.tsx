import { useFetchBrandList } from '@/hooks/apis/brand'
import { useFetchCategoryList } from '@/hooks/apis/category'
import { useFetchUpdateProduct } from '@/hooks/apis/product'
import { useFetchProductTypeBySubCategory } from '@/hooks/apis/product-type'
import { useFetchSubCategoryByCategory } from '@/hooks/apis/sub-category'
import { ProductDetailData } from '@/types/product.type'
import CloseIcon from '@mui/icons-material/Close'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export interface EditProductModalProps {
  open: boolean
  onClose: () => void
  product: ProductDetailData | null
}

// Styled component for hidden file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

export default function EditProductModal({ open, onClose, product }: EditProductModalProps) {
  // STATE DECLARATIONS
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    salePrice: 0,
    videoUrl: '',
    isHotSale: false,
    isFeatured: false,
    isDeleted: false,
    productTypeId: '',
    brandId: '',
    subCategoryId: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [defaultImageFile, setDefaultImageFile] = useState<File | null>(null)
  const [defaultImagePreview, setDefaultImagePreview] = useState<string>('')
  const [currentDefaultImageId, setCurrentDefaultImageId] = useState<string>('')
  const [description, setDescription] = useState<Array<{ type: string; content: string | string[] | { src: string; alt: string } }>>([])
  const [categoryId, setCategoryId] = useState<string>('')

  // HOOKS
  const { data: brandList, isLoading: isBrandLoading } = useFetchBrandList()
  const { data: categoryList, isLoading: isCategoryLoading } = useFetchCategoryList()
  const { data: subCategoryList, isLoading: isSubCategoryLoading } = useFetchSubCategoryByCategory(categoryId)
  const { data: productTypeList, isLoading: isProductTypeLoading } = useFetchProductTypeBySubCategory(formData.subCategoryId)

  const { mutate: updateProduct, isPending: isUpdatingProduct } = useFetchUpdateProduct({
    onSuccess: () => {
      toast.success('Cập nhật sản phẩm thành công!')
      onClose()
    },
    onError: error => {
      toast.error('Cập nhật sản phẩm thất bại')
      console.error(error)
      setIsSubmitting(false)
    }
  })

  // Initialize form with product data when it changes
  useEffect(() => {
    if (product) {
      // Find the category ID from the subcategory
      setCategoryId(product.category.id)

      setFormData({
        name: product.name,
        price: product.price,
        salePrice: product.salePrice || 0,
        videoUrl: product.videoUrl || '',
        isHotSale: product.isHotSale,
        isFeatured: product.isFeatured,
        isDeleted: product.isDeleted || false,
        productTypeId: product.productType?.id || '',
        brandId: product.brand.id,
        subCategoryId: product.subCategory.id
      })

      // Parse description if it's a string
      const descriptionData = typeof product.description === 'string' ? JSON.parse(product.description) : product.description || []

      setDescription(descriptionData)

      // Handle images
      if (product.images) {
        // Set existing images
        setExistingImages(product.images)

        // Set additional image previews
        setAdditionalImagesPreview(product.images.map(img => img.url))
      }

      // Set default image if exists
      if (product.defaultImage) {
        setCurrentDefaultImageId(product.defaultImage.id)
        setDefaultImagePreview(product.defaultImage.url)
      }
    }
  }, [product])

  // UTILITY FUNCTIONS
  function getInitialContent(type: string) {
    switch (type) {
      case 'specs':
        return ['']
      case 'image':
        return { src: '', alt: '' }
      default:
        return ''
    }
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) errors.name = 'Tên sản phẩm là bắt buộc'
    if (!formData.price || formData.price <= 0) errors.price = 'Giá phải lớn hơn 0'
    if (!formData.brandId) errors.brandId = 'Thương hiệu là bắt buộc'
    if (!formData.subCategoryId) errors.subCategoryId = 'Danh mục con là bắt buộc'

    // Check if we have either a default image set or a new one being uploaded
    if (!currentDefaultImageId && !defaultImageFile && existingImages.length === 0) {
      errors.defaultImage = 'Hình ảnh mặc định là bắt buộc'
    }

    // Validate total number of additional images (existing + new)
    if (additionalImages.length > 8) {
      errors.additionalImages = 'Tối đa 8 hình ảnh bổ sung được phép'
    }

    // Validate video URL if provided
    if (formData.videoUrl && !isValidVideoUrl(formData.videoUrl)) {
      errors.videoUrl = 'Vui lòng nhập URL YouTube hoặc Vimeo hợp lệ'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  function isValidVideoUrl(url: string): boolean {
    // Simple validation for YouTube or Vimeo URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/i
    return url === '' || youtubeRegex.test(url) || vimeoRegex.test(url)
  }

  // EVENT HANDLERS
  function handleAddDescription() {
    setDescription([...description, { type: 'heading', content: '' }])
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  function handleSelectChange(e: SelectChangeEvent) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  function handleCategoryChange(e: SelectChangeEvent) {
    const newCategoryId = e.target.value
    setCategoryId(newCategoryId)
    setFormData(prev => ({
      ...prev,
      subCategoryId: '',
      productTypeId: ''
    }))
  }

  function handleRadioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === 'true'
    }))
  }

  function handleAdditionalImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)

      // Validate file types and sizes
      const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith('image/')
        const isValidSize = file.size < 5 * 1024 * 1024 // 5MB max

        if (!isValidType) {
          toast.error(`File "${file.name}" is not a valid image`)
        }
        if (!isValidSize) {
          toast.error(`File "${file.name}" exceeds 5MB size limit`)
        }

        return isValidType && isValidSize
      })

      if (additionalImages.length + validFiles.length > 8) {
        toast.error('Maximum 8 additional images allowed')
        return
      }

      setAdditionalImages(prev => [...prev, ...validFiles])

      // Create preview URLs for the images
      const newPreviews = validFiles.map(file => URL.createObjectURL(file))
      setAdditionalImagesPreview(prev => [...prev, ...newPreviews])

      // Clear validation error
      if (validationErrors.additionalImages) {
        setValidationErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.additionalImages
          return newErrors
        })
      }
    }
  }

  function handleDefaultImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Validate file type and size
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size < 5 * 1024 * 1024 // 5MB max

      if (!isValidType) {
        toast.error(`File "${file.name}" is not a valid image`)
        return
      }

      if (!isValidSize) {
        toast.error(`File "${file.name}" exceeds 5MB size limit`)
        return
      }

      setDefaultImageFile(file)
      setCurrentDefaultImageId('')

      // Create preview URL
      const preview = URL.createObjectURL(file)
      setDefaultImagePreview(preview)

      // Clear validation error
      if (validationErrors.defaultImage) {
        setValidationErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.defaultImage
          return newErrors
        })
      }
    }
  }

  function handleSetExistingAsDefault(imageId: string, imageUrl: string) {
    // Clear any previously selected default image file
    setDefaultImageFile(null)

    // Set the existing image as default
    setCurrentDefaultImageId(imageId)
    setDefaultImagePreview(imageUrl)

    // Clear validation error
    if (validationErrors.defaultImage) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.defaultImage
        return newErrors
      })
    }
  }

  function handleRemoveImage(indexToRemove: number) {
    // If it's an existing image
    if (indexToRemove < existingImages.length) {
      const removedImage = existingImages[indexToRemove]

      // Check if the removed image is the current default
      if (removedImage.id === currentDefaultImageId) {
        setCurrentDefaultImageId('')
        setDefaultImagePreview('')
      }

      // Add to images to delete list if it's an existing image
      setImagesToDelete(prev => [...prev, removedImage.id])

      // Remove from existing images array
      setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove))
    } else {
      // Remove newly uploaded image (adjust index)
      const adjustedIndex = indexToRemove - existingImages.length
      setAdditionalImages(prev => prev.filter((_, index) => index !== adjustedIndex))

      // Clean up preview URL to avoid memory leaks
      URL.revokeObjectURL(additionalImagesPreview[adjustedIndex + existingImages.length])
    }

    // Remove from preview array regardless of source
    setAdditionalImagesPreview(prev => prev.filter((_, index) => index !== indexToRemove))

    // Check if we need to show validation error
    if (additionalImagesPreview.length <= 1 && !defaultImageFile && !currentDefaultImageId) {
      setValidationErrors(prev => ({
        ...prev,
        defaultImage: 'At least one product image is required'
      }))
    }
  }

  function handleRemoveDefaultImage() {
    setDefaultImageFile(null)
    setDefaultImagePreview('')
    setCurrentDefaultImageId('')

    // Show validation error if no images left
    if (existingImages.length === 0 && additionalImages.length === 0) {
      setValidationErrors(prev => ({
        ...prev,
        defaultImage: 'Default product image is required'
      }))
    }
  }

  function handleCancel() {
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm() || !product) {
      toast.error('Vui lòng sửa lỗi trong biểu mẫu')
      return
    }

    setIsSubmitting(true)

    try {
      // Create a single form data object for all changes
      const productData = new FormData()

      // Basic product info
      productData.append('name', formData.name)
      productData.append('description', JSON.stringify(description))
      productData.append('price', formData.price.toString())
      if (formData.salePrice > 0) {
        productData.append('salePrice', formData.salePrice.toString())
      }
      if (formData.videoUrl) {
        productData.append('videoUrl', formData.videoUrl)
      }

      // Boolean properties
      productData.append('isHotSale', JSON.stringify(formData.isHotSale))
      productData.append('isFeatured', JSON.stringify(formData.isFeatured))
      productData.append('isDeleted', JSON.stringify(formData.isDeleted))

      // Relationships
      productData.append('brandId', formData.brandId)
      productData.append('subCategoryId', formData.subCategoryId)
      if (formData.productTypeId) {
        productData.append('productTypeId', formData.productTypeId)
      }

      // Handle images to delete
      if (imagesToDelete.length > 0) {
        productData.append('imageIdsToDelete', JSON.stringify(imagesToDelete))
      }

      // Handle default image changes
      if (defaultImageFile) {
        // Attach new default image file
        productData.append('defaultImage', defaultImageFile)
      } else if (currentDefaultImageId) {
        // Set existing image as default
        productData.append('defaultImageId', currentDefaultImageId)
      }

      // Add additional images
      if (additionalImages.length > 0) {
        for (let i = 0; i < additionalImages.length; i++) {
          productData.append('productImages', additionalImages[i])
        }
      }

      // Send the update request
      updateProduct({ id: product.id, data: productData })
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Đã xảy ra lỗi không mong muốn')
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '70%' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <IconButton
          aria-label='close'
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            color: '#9e9e9e'
          }}
          sx={{
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant='h5' mb={3} style={{ paddingRight: 32 }}>
          Chỉnh sửa sản phẩm
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid size={12}>
              <Card>
                <CardContent>
                  <Typography variant='h6' mb={2}>
                    Thông tin cơ bản
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label='Tên sản phẩm'
                        name='name'
                        value={formData.name || ''}
                        onChange={handleChange}
                        required
                        error={!!validationErrors.name}
                        helperText={validationErrors.name}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        fullWidth
                        label='Giá'
                        name='price'
                        type='number'
                        value={formData.price || ''}
                        onChange={handleChange}
                        required
                        error={!!validationErrors.price}
                        helperText={validationErrors.price}
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField fullWidth label='Giá khuyến mại' name='salePrice' type='number' value={formData.salePrice || ''} onChange={handleChange} />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label='URL Video (YouTube hoặc Vimeo)'
                        name='videoUrl'
                        value={formData.videoUrl || ''}
                        onChange={handleChange}
                        placeholder='https://youtube.com/watch?v=...'
                        error={!!validationErrors.videoUrl}
                        helperText={validationErrors.videoUrl || 'Tùy chọn: Thêm video giới thiệu sản phẩm'}
                      />
                    </Grid>
                    <Grid size={4}>
                      <FormControl component='fieldset'>
                        <FormLabel component='legend'>Sản phẩm nổi bật</FormLabel>
                        <RadioGroup row name='isFeatured' value={(formData.isFeatured || false).toString()} onChange={handleRadioChange}>
                          <FormControlLabel value='true' control={<Radio />} label='Có' />
                          <FormControlLabel value='false' control={<Radio />} label='Không' />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid size={4}>
                      <FormControl component='fieldset'>
                        <FormLabel component='legend'>Hot Sale</FormLabel>
                        <RadioGroup row name='isHotSale' value={(formData.isHotSale || false).toString()} onChange={handleRadioChange}>
                          <FormControlLabel value='true' control={<Radio />} label='Có' />
                          <FormControlLabel value='false' control={<Radio />} label='Không' />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid size={4}>
                      <FormControl component='fieldset'>
                        <FormLabel component='legend'>Trạng thái</FormLabel>
                        <RadioGroup row name='isDeleted' value={(formData.isDeleted || false).toString()} onChange={handleRadioChange}>
                          <FormControlLabel value='false' control={<Radio />} label='Hoạt động' />
                          <FormControlLabel value='true' control={<Radio />} label='Đã xóa' />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Category Information */}
            <Grid size={12}>
              <Card>
                <CardContent>
                  <Typography variant='h6' mb={2}>
                    Thông tin danh mục
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <FormControl fullWidth disabled={isCategoryLoading} error={!!validationErrors.categoryId}>
                        <InputLabel>Danh mục</InputLabel>
                        <Select
                          MenuProps={{ PaperProps: { style: { maxHeight: 200, overflowY: 'auto' } } }}
                          name='categoryId'
                          value={categoryId}
                          onChange={handleCategoryChange}
                          label='Danh mục'
                          required
                        >
                          {categoryList?.data.map(category => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {validationErrors.categoryId && <FormHelperText>{validationErrors.categoryId}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid size={4}>
                      <FormControl fullWidth disabled={!categoryId || isSubCategoryLoading} error={!!validationErrors.subCategoryId}>
                        <InputLabel>Danh mục con</InputLabel>
                        <Select
                          MenuProps={{ PaperProps: { style: { maxHeight: 200, overflowY: 'auto' } } }}
                          name='subCategoryId'
                          value={formData.subCategoryId || ''}
                          onChange={handleSelectChange}
                          label='Danh mục con'
                          required
                        >
                          {subCategoryList?.data.map(subCategory => (
                            <MenuItem key={subCategory.id} value={subCategory.id}>
                              {subCategory.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {validationErrors.subCategoryId && <FormHelperText>{validationErrors.subCategoryId}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid size={4}>
                      <FormControl fullWidth disabled={!formData.subCategoryId || isProductTypeLoading}>
                        <InputLabel>Loại sản phẩm</InputLabel>
                        <Select
                          MenuProps={{ PaperProps: { style: { maxHeight: 200, overflowY: 'auto' } } }}
                          name='productTypeId'
                          value={formData.productTypeId || ''}
                          onChange={handleSelectChange}
                          label='Loại sản phẩm'
                        >
                          {productTypeList?.data.map(type => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={12}>
                      <FormControl fullWidth disabled={isBrandLoading} error={!!validationErrors.brandId}>
                        <InputLabel>Thương hiệu</InputLabel>
                        <Select
                          MenuProps={{ PaperProps: { style: { maxHeight: 200, overflowY: 'auto' } } }}
                          name='brandId'
                          value={formData.brandId || ''}
                          onChange={handleSelectChange}
                          label='Thương hiệu'
                          required
                        >
                          {brandList?.data.map(brand => (
                            <MenuItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {validationErrors.brandId && <FormHelperText>{validationErrors.brandId}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Product Description */}
            <Grid size={12}>
              <Card>
                <CardContent>
                  <Typography variant='h6' mb={2}>
                    Mô tả sản phẩm
                  </Typography>
                  <Box>
                    {description.map((item, index) => (
                      <Box
                        key={index}
                        mb={3}
                        p={2}
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 4
                        }}
                      >
                        <Select
                          value={item.type}
                          onChange={e => {
                            const newDesc = [...description]
                            newDesc[index].type = e.target.value
                            newDesc[index].content = getInitialContent(e.target.value)
                            setDescription(newDesc)
                          }}
                          fullWidth
                          size='small'
                          style={{ marginBottom: 8 }}
                        >
                          {[
                            { value: 'heading', label: 'Tiêu đề' },
                            { value: 'paragraph', label: 'Đoạn văn' },
                            { value: 'specs', label: 'Thông số kỹ thuật' },
                            { value: 'image', label: 'Hình ảnh' }
                          ].map(type => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>

                        {item.type === 'specs' ? (
                          <Box mt={1}>
                            {(item.content as string[]).map((spec: string, i: number) => (
                              <TextField
                                key={i}
                                label={`Thông số ${i + 1}`}
                                value={spec}
                                onChange={e => {
                                  const newDesc = [...description]
                                  ;(newDesc[index].content as string[])[i] = e.target.value
                                  setDescription(newDesc)
                                }}
                                fullWidth
                                margin='dense'
                                size='small'
                              />
                            ))}
                            <Button
                              onClick={() => {
                                const newDesc = [...description]
                                ;(newDesc[index].content as string[]).push('')
                                setDescription(newDesc)
                              }}
                              size='small'
                              variant='outlined'
                              style={{ marginTop: 8 }}
                            >
                              Thêm dòng thông số
                            </Button>
                          </Box>
                        ) : item.type === 'image' ? (
                          <Box mt={1}>
                            <TextField
                              label='URL hình ảnh'
                              value={(item.content as { src: string; alt: string }).src || ''}
                              onChange={e => {
                                const newDesc = [...description]
                                ;(newDesc[index].content as { src: string; alt: string }).src = e.target.value
                                setDescription(newDesc)
                              }}
                              fullWidth
                              margin='dense'
                              size='small'
                            />
                            <TextField
                              label='Mô tả hình ảnh'
                              value={(item.content as { src: string; alt: string }).alt || ''}
                              onChange={e => {
                                const newDesc = [...description]
                                ;(newDesc[index].content as { src: string; alt: string }).alt = e.target.value
                                setDescription(newDesc)
                              }}
                              fullWidth
                              margin='dense'
                              size='small'
                            />
                          </Box>
                        ) : (
                          <TextField
                            label='Nội dung'
                            value={item.content as string}
                            onChange={e => {
                              const newDesc = [...description]
                              newDesc[index].content = e.target.value
                              setDescription(newDesc)
                            }}
                            fullWidth
                            multiline
                            rows={item.type === 'paragraph' ? 4 : 1}
                            margin='dense'
                            size='small'
                          />
                        )}

                        <Box display='flex' justifyContent='flex-end' mt={1}>
                          <Button
                            onClick={() => {
                              const newDesc = [...description]
                              newDesc.splice(index, 1)
                              setDescription(newDesc)
                            }}
                            color='error'
                            size='small'
                            variant='outlined'
                          >
                            Xoá
                          </Button>
                        </Box>
                      </Box>
                    ))}

                    <Button variant='contained' onClick={handleAddDescription} size='small'>
                      Thêm mục mô tả
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Product Images */}
            <Grid size={12}>
              <Card>
                <CardContent>
                  <Typography variant='h6' mb={2}>
                    Hình ảnh sản phẩm
                  </Typography>

                  {/* Default Image */}
                  <Box mb={4}>
                    <Typography variant='subtitle1' mb={1} fontWeight='bold'>
                      Hình ảnh mặc định (Bắt buộc)
                    </Typography>

                    <Button
                      component='label'
                      variant='contained'
                      startIcon={<CloudUploadIcon />}
                      color={validationErrors.defaultImage ? 'error' : 'primary'}
                      fullWidth
                      style={{ paddingTop: 12, paddingBottom: 12, marginBottom: 16 }}
                    >
                      Tải lên hình ảnh mặc định
                      <VisuallyHiddenInput type='file' accept='image/*' onChange={handleDefaultImageChange} />
                    </Button>

                    {validationErrors.defaultImage && (
                      <FormHelperText error style={{ marginBottom: 16 }}>
                        {validationErrors.defaultImage}
                      </FormHelperText>
                    )}

                    {/* Default image preview */}
                    {defaultImagePreview && (
                      <Box
                        position='relative'
                        width={200}
                        height={200}
                        borderRadius={1}
                        mb={2}
                        style={{
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          overflow: 'hidden',
                          border: '2px solid #4caf50'
                        }}
                      >
                        <Box
                          component='img'
                          src={defaultImagePreview}
                          alt='Hình ảnh mặc định'
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <IconButton
                          size='small'
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            padding: '4px'
                          }}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.7)'
                            }
                          }}
                          onClick={handleRemoveDefaultImage}
                        >
                          <CloseIcon fontSize='small' />
                        </IconButton>
                        <Typography
                          variant='caption'
                          position='absolute'
                          bottom={0}
                          left={0}
                          right={0}
                          style={{
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            padding: '4px',
                            textAlign: 'center'
                          }}
                        >
                          Hình ảnh mặc định
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Additional Images */}
                  <Box mb={2}>
                    <Typography variant='subtitle1' mb={1} fontWeight='bold'>
                      Hình ảnh bổ sung (Tùy chọn, Tối đa 8)
                    </Typography>

                    <Button
                      component='label'
                      variant='contained'
                      startIcon={<CloudUploadIcon />}
                      color={validationErrors.additionalImages ? 'error' : 'primary'}
                      fullWidth
                      style={{ paddingTop: 12, paddingBottom: 12, marginBottom: 16 }}
                    >
                      Tải lên hình ảnh bổ sung
                      <VisuallyHiddenInput type='file' multiple accept='image/*' onChange={handleAdditionalImagesChange} />
                    </Button>

                    {validationErrors.additionalImages && (
                      <FormHelperText error style={{ marginBottom: 16 }}>
                        {validationErrors.additionalImages}
                      </FormHelperText>
                    )}

                    {/* Summary of changes */}
                    {(additionalImages.length > 0 || imagesToDelete.length > 0) && (
                      <Box mb={2} mt={2}>
                        {additionalImages.length > 0 && (
                          <Typography variant='body2' color='primary'>
                            {additionalImages.length} hình ảnh mới sẽ được thêm
                          </Typography>
                        )}
                        {imagesToDelete.length > 0 && (
                          <Typography variant='body2' color='error'>
                            {imagesToDelete.length} hình ảnh sẽ bị xóa
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* All images preview (including existing ones) */}
                    {additionalImagesPreview.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                        {additionalImagesPreview.map((preview, index) => {
                          // Determine if this is an existing image
                          const isExistingImage = index < existingImages.length
                          const imageId = isExistingImage ? existingImages[index].id : ''
                          const isDefaultImage = imageId === currentDefaultImageId

                          return (
                            <Box
                              key={index}
                              sx={{
                                position: 'relative',
                                width: 120,
                                height: 120,
                                borderRadius: 1,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                overflow: 'hidden',
                                border: isDefaultImage ? '2px solid #4caf50' : 'none',
                                opacity: imagesToDelete.includes(imageId) ? 0.5 : 1
                              }}
                            >
                              <Box
                                component='img'
                                src={preview}
                                alt={`Xem trước ${index + 1}`}
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}
                              >
                                <IconButton
                                  size='small'
                                  sx={{
                                    'backgroundColor': 'rgba(0,0,0,0.5)',
                                    'color': 'white',
                                    'padding': '4px',
                                    'margin': '2px',
                                    '&:hover': {
                                      backgroundColor: 'rgba(0,0,0,0.7)'
                                    }
                                  }}
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  <CloseIcon fontSize='small' />
                                </IconButton>

                                {/* Only show "Set as Default" button for existing images */}
                                {isExistingImage && !isDefaultImage && !imagesToDelete.includes(imageId) && (
                                  <IconButton
                                    size='small'
                                    sx={{
                                      'backgroundColor': 'rgba(76, 175, 80, 0.7)',
                                      'color': 'white',
                                      'padding': '4px',
                                      'margin': '2px',
                                      '&:hover': {
                                        backgroundColor: 'rgba(76, 175, 80, 0.9)'
                                      }
                                    }}
                                    onClick={() => handleSetExistingAsDefault(imageId, preview)}
                                    title='Đặt làm hình ảnh mặc định'
                                  >
                                    <span style={{ fontSize: '18px' }}>✓</span>
                                  </IconButton>
                                )}
                              </Box>

                              {isDefaultImage && (
                                <Typography
                                  variant='caption'
                                  sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(76, 175, 80, 0.7)',
                                    color: 'white',
                                    padding: '2px',
                                    textAlign: 'center'
                                  }}
                                >
                                  Mặc định
                                </Typography>
                              )}

                              {/* Show deletion indicator */}
                              {imagesToDelete.includes(imageId) && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                  }}
                                >
                                  <Typography variant='body2' color='error' sx={{ fontWeight: 'bold' }}>
                                    ĐANG XÓA
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          )
                        })}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box display='flex' justifyContent='flex-end' gap={2} mt={3}>
            <Button variant='outlined' onClick={handleCancel} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type='submit' variant='contained' disabled={isSubmitting || isUpdatingProduct} startIcon={isSubmitting || isUpdatingProduct ? <CircularProgress size={20} /> : null}>
              {isSubmitting || isUpdatingProduct ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}
