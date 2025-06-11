import { CreateInvoiceFormData, useFetchCreateInvoice } from '@/hooks/apis/invoice'
import { useFetchProductList } from '@/hooks/apis/product'
import { SupplierData, useFetchSupplierList } from '@/hooks/apis/supplier'
import { ProductListData } from '@/types/product.type'
import { formatCurrency } from '@/utils/format'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import ReceiptIcon from '@mui/icons-material/Receipt'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'

export interface CreateInvoiceModalProps {
  open: boolean
  onClose: () => void
}

// Default empty item
const emptyItem = { productId: '', quantity: 1, importPrice: 0 }

export default function CreateInvoiceModal({ open, onClose }: CreateInvoiceModalProps) {
  // Form data
  const [formData, setFormData] = useState<CreateInvoiceFormData>({
    supplierId: '',
    note: '',
    items: []
  })

  // Current item being edited
  const [currentItem, setCurrentItem] = useState({ ...emptyItem })
  const [showItemForm, setShowItemForm] = useState(false)

  // API data
  const { data: productData, isLoading: isLoadingProducts } = useFetchProductList()
  const { data: supplierData, isLoading: isLoadingSuppliers } = useFetchSupplierList()
  const products = productData?.data || []
  const suppliers = supplierData?.data || []

  // Create invoice mutation
  const { mutate: createInvoice, isPending } = useFetchCreateInvoice({
    onSuccess: () => {
      toast.success('Tạo hóa đơn thành công')
      onClose()
    },
    onError: error => {
      toast.error(error.message || 'Tạo hóa đơn thất bại')
    }
  })

  // Handlers
  const handleSupplierChange = (supplierId: string) => {
    setFormData(prev => ({ ...prev, supplierId }))
  }

  const handleNoteChange = (note: string) => {
    setFormData(prev => ({ ...prev, note }))
  }

  const handleAddItemClick = () => {
    setShowItemForm(true)
    setCurrentItem({ ...emptyItem })
  }

  const handleCancelItem = () => {
    setShowItemForm(false)
  }

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleProductChange = (productId: string) => {
    const selectedProduct = products.find((p: ProductListData) => p.id === productId)

    setCurrentItem({
      productId,
      quantity: 1,
      importPrice: selectedProduct?.price || 0
    })
  }

  const handleQuantityChange = (quantity: number) => {
    setCurrentItem(prev => ({
      ...prev,
      quantity: quantity > 0 ? quantity : 1
    }))
  }

  const handlePriceChange = (price: number) => {
    setCurrentItem(prev => ({
      ...prev,
      importPrice: price >= 0 ? price : 0
    }))
  }

  const handleAddItem = () => {
    if (!currentItem.productId) {
      toast.error('Vui lòng chọn sản phẩm')
      return
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, currentItem]
    }))

    setShowItemForm(false)
    setCurrentItem({ ...emptyItem })
  }

  const handleSubmit = () => {
    if (!formData.supplierId) {
      toast.error('Vui lòng chọn nhà cung cấp')
      return
    }

    if (formData.items.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm')
      return
    }

    createInvoice(formData)
  }

  // Calculate total amount
  const totalAmount = formData.items.reduce((sum, item) => sum + item.quantity * item.importPrice, 0)

  // Loading state
  const isLoading = isLoadingProducts || isLoadingSuppliers

  // Get product name from id
  const getProductName = (productId: string) => {
    const product = products.find((p: ProductListData) => p.id === productId)
    return product ? product.name : productId
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptIcon sx={{ mr: 1 }} />
          Tạo hóa đơn mới
        </Box>
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            {/* Supplier Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='h6' gutterBottom>
                Thông tin nhà cung cấp
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Nhà cung cấp *</InputLabel>
                <Select value={formData.supplierId} label='Nhà cung cấp *' onChange={e => handleSupplierChange(e.target.value)}>
                  {suppliers.map((supplier: SupplierData) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField fullWidth label='Ghi chú' placeholder='Nhập ghi chú hóa đơn (nếu có)' value={formData.note} onChange={e => handleNoteChange(e.target.value)} multiline rows={2} />
            </Box>

            {/* Products Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='h6' gutterBottom>
                Danh sách sản phẩm
              </Typography>

              {/* Product Table */}
              <TableContainer component={Paper} variant='outlined' sx={{ mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align='right'>Số lượng</TableCell>
                      <TableCell align='right'>Giá nhập</TableCell>
                      <TableCell align='right'>Thành tiền</TableCell>
                      <TableCell align='center'>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align='center'>
                          Chưa có sản phẩm nào. Vui lòng thêm sản phẩm.
                        </TableCell>
                      </TableRow>
                    ) : (
                      formData.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{getProductName(item.productId)}</TableCell>
                          <TableCell align='right'>{item.quantity}</TableCell>
                          <TableCell align='right'>{formatCurrency(item.importPrice)}</TableCell>
                          <TableCell align='right'>{formatCurrency(item.quantity * item.importPrice)}</TableCell>
                          <TableCell align='center'>
                            <IconButton size='small' color='error' onClick={() => handleRemoveItem(index)}>
                              <DeleteIcon fontSize='small' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {formData.items.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align='right' sx={{ fontWeight: 'bold' }}>
                          Tổng cộng:
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(totalAmount)}
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Add Item Form */}
              {showItemForm ? (
                <Paper variant='outlined' sx={{ p: 2 }}>
                  <Typography variant='subtitle1' gutterBottom>
                    Thêm sản phẩm
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <FormControl sx={{ minWidth: 200, flexGrow: 1 }}>
                      <InputLabel>Sản phẩm *</InputLabel>
                      <Select value={currentItem.productId} label='Sản phẩm *' onChange={e => handleProductChange(e.target.value)}>
                        {products.map((product: ProductListData) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField label='Số lượng' type='number' inputProps={{ min: 1 }} value={currentItem.quantity} onChange={e => handleQuantityChange(parseInt(e.target.value))} sx={{ width: 120 }} />

                    <TextField
                      label='Giá nhập'
                      type='number'
                      inputProps={{ min: 0 }}
                      value={currentItem.importPrice}
                      onChange={e => handlePriceChange(parseFloat(e.target.value))}
                      sx={{ width: 180 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant='outlined' onClick={handleCancelItem}>
                      Hủy
                    </Button>
                    <Button variant='contained' color='primary' onClick={handleAddItem} disabled={!currentItem.productId}>
                      Thêm
                    </Button>
                  </Box>
                </Paper>
              ) : (
                <Button variant='outlined' startIcon={<AddIcon />} onClick={handleAddItemClick} fullWidth sx={{ py: 1 }}>
                  Thêm sản phẩm
                </Button>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Hủy
        </Button>
        <Button variant='contained' onClick={handleSubmit} disabled={isPending || formData.items.length === 0 || !formData.supplierId} startIcon={isPending ? <CircularProgress size={20} /> : null}>
          {isPending ? 'Đang tạo...' : 'Tạo hóa đơn'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
