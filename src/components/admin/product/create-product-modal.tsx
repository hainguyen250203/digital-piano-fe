import { useFetchBrandList } from '@/hooks/apis/brand'
import { useFetchCategoryList } from '@/hooks/apis/category'
import { useFetchCreateProduct } from '@/hooks/apis/product'
import { useFetchProductTypeBySubCategory } from '@/hooks/apis/product-type'
import { useFetchSubCategoryByCategory } from '@/hooks/apis/sub-category'
import { CreateProductFormData } from '@/types/product.type'
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
import { useState } from 'react'
import { toast } from 'react-toastify'

export interface CreateProductModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateProductModal({ open, onClose }: CreateProductModalProps) {
  // ===== STATE DECLARATIONS =====
  const [formData, setFormData] = useState<CreateProductFormData>({
    name: '',
    price: 0,
    salePrice: null,
    description: [],
    imageFiles: [],
    defaultImage: null,
    isHotSale: false,
    isFeatured: false,
    productTypeId: '',
    brandId: '',
    subCategoryId: '',
    videoUrl: ''
  } as CreateProductFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadPreview, setUploadPreview] = useState<string[]>([])
  const [defaultImageFile, setDefaultImageFile] = useState<File | null>(null)
  const [defaultImagePreview, setDefaultImagePreview] = useState<string>('')
  const [description, setDescription] = useState<Array<{ type: string; content: string | string[] | { src: string; alt: string } }>>([{ type: 'heading', content: '' }])
  const [categoryId, setCategoryId] = useState<string>('')

  // ===== HOOKS =====
  const { data: brandList, isLoading: isBrandLoading } = useFetchBrandList()
  const { data: categoryList, isLoading: isCategoryLoading } = useFetchCategoryList()
  const { data: subCategoryList, isLoading: isSubCategoryLoading } = useFetchSubCategoryByCategory(categoryId)
  const { data: productTypeList, isLoading: isProductTypeLoading } = useFetchProductTypeBySubCategory(formData.subCategoryId)
  const { mutate: createProduct } = useFetchCreateProduct({
    onSuccess: () => {
      toast.success('Tạo sản phẩm thành công!')
      resetForm()
      onClose()
    },
    onError: error => {
      toast.error('Tạo sản phẩm thất bại')
      console.log(error)
      setIsSubmitting(false)
    }
  })

  // ===== UTILITY FUNCTIONS =====
  const getInitialContent = (type: string) => {
    switch (type) {
      case 'specs':
        return ['']
      case 'image':
        return { src: '', alt: '' }
      default:
        return ''
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      salePrice: null,
      description: [],
      imageFiles: [],
      defaultImage: null,
      isHotSale: false,
      isFeatured: false,
      productTypeId: '',
      brandId: '',
      subCategoryId: '',
      videoUrl: ''
    })
    setCategoryId('')
    setUploadedFiles([])
    setUploadPreview([])
    setDefaultImageFile(null)
    setDefaultImagePreview('')
    setValidationErrors({})
    setIsSubmitting(false)
    setDescription([{ type: 'heading', content: '' }])
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name?.trim()) errors.name = 'Tên sản phẩm là bắt buộc'
    if (!formData.price || formData.price <= 0) errors.price = 'Giá phải lớn hơn 0'
    if (!formData.brandId) errors.brandId = 'Thương hiệu là bắt buộc'
    if (!formData.subCategoryId) errors.subCategoryId = 'Danh mục con là bắt buộc'
    if (!defaultImageFile) errors.defaultImage = 'Hình ảnh mặc định là bắt buộc'
    if (uploadedFiles.length > 8) errors.images = 'Tối đa 8 hình ảnh bổ sung được phép'

    // Validate video URL if provided
    if (formData.videoUrl && !isValidVideoUrl(formData.videoUrl)) {
      errors.videoUrl = 'Vui lòng nhập URL YouTube hoặc Vimeo hợp lệ'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isValidVideoUrl = (url: string): boolean => {
    // Simple validation for YouTube or Vimeo URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/i
    return url === '' || youtubeRegex.test(url) || vimeoRegex.test(url)
  }

  // ===== EVENT HANDLERS =====
  const handleAddDescription = () => {
    setDescription([...description, { type: 'heading', content: '' }])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSelectChange = (e: SelectChangeEvent) => {
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

  const handleCategoryChange = (e: SelectChangeEvent) => {
    const newCategoryId = e.target.value
    setCategoryId(newCategoryId)
    setFormData(prev => ({
      ...prev,
      subCategoryId: '',
      productTypeId: ''
    }))
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === 'true'
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)

      // Validate file types and sizes
      const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith('image/')
        const isValidSize = file.size < 5 * 1024 * 1024 // 5MB max

        if (!isValidType) {
          toast.error('Mỗi hình ảnh không được vượt quá 5MB')
        }
        if (!isValidSize) {
          toast.error('Mỗi hình ảnh không được vượt quá 5MB')
        }

        return isValidType && isValidSize
      })

      setUploadedFiles(validFiles)

      // Create preview URLs for the images
      const previews = validFiles.map(file => URL.createObjectURL(file))
      setUploadPreview(previews)

      // Update formData
      setFormData(prev => ({
        ...prev,
        imageFiles: validFiles
      }))

      // Clear validation error
      if (validationErrors.images) {
        setValidationErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.images
          return newErrors
        })
      }
    }
  }

  const handleDefaultImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Validate file type and size
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size < 5 * 1024 * 1024 // 5MB max

      if (!isValidType) {
        toast.error('Mỗi hình ảnh không được vượt quá 5MB')
        return
      }

      if (!isValidSize) {
        toast.error('Mỗi hình ảnh không được vượt quá 5MB')
        return
      }

      setDefaultImageFile(file)

      // Create preview URL
      const preview = URL.createObjectURL(file)
      setDefaultImagePreview(preview)

      // Update formData
      setFormData(prev => ({
        ...prev,
        defaultImage: file
      }))

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

  const handleRemoveImage = (indexToRemove: number) => {
    // Remove from preview array
    const newPreviews = uploadPreview.filter((_, index) => index !== indexToRemove)
    setUploadPreview(newPreviews)

    // Remove from files array
    const newFiles = uploadedFiles.filter((_, index) => index !== indexToRemove)
    setUploadedFiles(newFiles)

    // Update formData
    setFormData(prev => ({
      ...prev,
      imageFiles: newFiles
    }))

    // If the last image was removed, show validation error
    if (newFiles.length === 0) {
      setValidationErrors(prev => ({
        ...prev,
        images: 'Ít nhất cần có một hình ảnh sản phẩm'
      }))
    }
  }

  const handleRemoveDefaultImage = () => {
    setDefaultImageFile(null)
    setDefaultImagePreview('')

    // Update formData
    setFormData(prev => ({
      ...prev,
      defaultImage: null
    }))

    // Show validation error
    setValidationErrors(prev => ({
      ...prev,
      defaultImage: 'Hình ảnh mặc định là bắt buộc'
    }))
  }

  const handleCancel = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Vui lòng sửa lỗi trong biểu mẫu')
      return
    }

    setIsSubmitting(true)

    try {
      const form = new FormData()

      // Append text fields
      form.append('name', formData.name)

      // Handle description - backend requires valid JSON string
      form.append('description', JSON.stringify(description))

      // Handle numeric values
      form.append('price', formData.price.toString())
      if (formData.salePrice !== undefined && formData.salePrice !== null) {
        form.append('salePrice', formData.salePrice.toString())
      }

      // Optional fields
      if (formData.videoUrl) form.append('videoUrl', formData.videoUrl)

      // Boolean fields - send as actual boolean values
      // FormData can only contain strings, so we'll send them as JSON for proper typing
      form.append('isHotSale', JSON.stringify(formData.isHotSale))
      form.append('isFeatured', JSON.stringify(formData.isFeatured))

      // References to other entities
      if (formData.productTypeId) form.append('productTypeId', formData.productTypeId)
      form.append('brandId', formData.brandId)
      form.append('subCategoryId', formData.subCategoryId)

      // Handle default image file
      if (defaultImageFile) {
        form.append('defaultImage', defaultImageFile)
      } else {
        toast.error('Hình ảnh mặc định là bắt buộc')
        setIsSubmitting(false)
        return
      }

      // Handle additional product image files
      if (uploadedFiles.length > 0) {
        if (uploadedFiles.length > 8) {
          toast.error('Tối đa 8 hình ảnh bổ sung được phép')
          setIsSubmitting(false)
          return
        }

        for (let i = 0; i < uploadedFiles.length; i++) {
          form.append('productImages', uploadedFiles[i])
        }
      }

      // Log the form data for debugging
      console.log('Submitting form data:')
      for (const pair of Array.from(form.entries())) {
        console.log(`${pair[0]}: ${typeof pair[1] === 'object' ? 'File: ' + (pair[1] as File).name : pair[1]}`)
      }

      createProduct(form)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  // ===== STYLED COMPONENTS =====
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

  // ===== RENDER =====
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
          Tạo sản phẩm mới
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
                    <Grid size={6}>
                      <FormControl component='fieldset'>
                        <FormLabel component='legend'>Sản phẩm nổi bật</FormLabel>
                        <RadioGroup row name='isFeatured' value={(formData.isFeatured || false).toString()} onChange={handleRadioChange}>
                          <FormControlLabel value='true' control={<Radio />} label='Có' />
                          <FormControlLabel value='false' control={<Radio />} label='Không' />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid size={6}>
                      <FormControl component='fieldset'>
                        <FormLabel component='legend'>Hot Sale</FormLabel>
                        <RadioGroup row name='isHotSale' value={(formData.isHotSale || false).toString()} onChange={handleRadioChange}>
                          <FormControlLabel value='true' control={<Radio />} label='Có' />
                          <FormControlLabel value='false' control={<Radio />} label='Không' />
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

                  {/* Default Image Upload */}
                  <Box mb={3}>
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
                    {validationErrors.defaultImage && <FormHelperText error>{validationErrors.defaultImage}</FormHelperText>}

                    {/* Default image preview */}
                    {defaultImagePreview && (
                      <Box
                        position='relative'
                        width={180}
                        height={180}
                        borderRadius={1}
                        mt={2}
                        style={{
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          overflow: 'hidden',
                          border: '2px solid #4caf50'
                        }}
                      >
                        <Box
                          component='img'
                          src={defaultImagePreview}
                          alt='Default product image'
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
                      </Box>
                    )}
                  </Box>

                  {/* Additional Images Upload */}
                  <Box mb={2}>
                    <Typography variant='subtitle1' mb={1} fontWeight='bold'>
                      Hình ảnh bổ sung (Tùy chọn, Tối đa 8)
                    </Typography>
                    <Button
                      component='label'
                      variant='contained'
                      startIcon={<CloudUploadIcon />}
                      color={validationErrors.images ? 'error' : 'primary'}
                      fullWidth
                      style={{ paddingTop: 12, paddingBottom: 12, marginBottom: 16 }}
                    >
                      Tải lên hình ảnh bổ sung
                      <VisuallyHiddenInput type='file' multiple accept='image/*' onChange={handleFileChange} />
                    </Button>
                    {validationErrors.images && <FormHelperText error>{validationErrors.images}</FormHelperText>}
                  </Box>

                  {/* Additional Images preview */}
                  {uploadPreview.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                      {uploadPreview.map((preview, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: 'relative',
                            width: 120,
                            height: 120,
                            borderRadius: 1,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            component='img'
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <IconButton
                            size='small'
                            sx={{
                              'position': 'absolute',
                              'top': 4,
                              'right': 4,
                              'backgroundColor': 'rgba(0,0,0,0.5)',
                              'color': 'white',
                              'padding': '4px',
                              '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)'
                              }
                            }}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <CloseIcon fontSize='small' />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box display='flex' justifyContent='flex-end' gap={2} mt={3}>
            <Button variant='outlined' onClick={handleCancel} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type='submit' variant='contained' disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} /> : null}>
              {isSubmitting ? 'Đang tạo...' : 'Tạo sản phẩm'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}
