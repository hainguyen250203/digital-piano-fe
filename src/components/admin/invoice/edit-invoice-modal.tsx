import { InvoiceData, useFetchUpdateInvoice } from '@/hooks/apis/invoice'
import { useFetchProductList } from '@/hooks/apis/product'
import { SupplierData, useFetchSupplierList } from '@/hooks/apis/supplier'
import { BatchUpdateItemDto, UpdateInvoiceWithItemsDto } from '@/services/apis/invoice'
import { ProductListData } from '@/types/product.type'
import { formatCurrency } from '@/utils/format'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

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
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export interface EditInvoiceModalProps {
  open: boolean
  onClose: () => void
  invoice: InvoiceData
}

// Default empty item for new additions
const emptyItem = { id: '', productId: '', quantity: 1, importPrice: 0 }

interface CurrentItemState {
  id: string
  productId: string
  quantity: number
  importPrice: number
  isNew: boolean
  index?: number
}

export default function EditInvoiceModal({ open, onClose, invoice }: EditInvoiceModalProps) {
  // Form data
  const [formData, setFormData] = useState<UpdateInvoiceWithItemsDto>({
    supplierId: '',
    note: '',
    items: []
  })

  // Current item being edited
  const [currentItem, setCurrentItem] = useState<CurrentItemState>({ ...emptyItem, isNew: true })
  const [showItemForm, setShowItemForm] = useState(false)

  // API data
  const { data: productData, isLoading: isLoadingProducts } = useFetchProductList()
  const { data: supplierData, isLoading: isLoadingSuppliers } = useFetchSupplierList()
  const products = productData?.data || []
  const suppliers = supplierData?.data || []

  // Update invoice mutation
  const { mutate: updateInvoice, isPending } = useFetchUpdateInvoice({
    onSuccess: () => {
      toast.success('Cập nhật hóa đơn thành công')
      onClose()
    },
    onError: error => {
      toast.error(error.message || 'Cập nhật hóa đơn thất bại')
    }
  })

  // Initialize form data when invoice changes
  useEffect(() => {
    if (invoice) {
      setFormData({
        supplierId: invoice.supplierId,
        note: invoice.note || '',
        items: invoice.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          importPrice: item.importPrice
        }))
      })
    }
  }, [invoice])

  // Handlers
  const handleSupplierChange = (supplierId: string) => {
    setFormData((prev: UpdateInvoiceWithItemsDto) => ({ ...prev, supplierId }))
  }

  const handleNoteChange = (note: string) => {
    setFormData((prev: UpdateInvoiceWithItemsDto) => ({ ...prev, note }))
  }

  const handleAddItemClick = () => {
    setShowItemForm(true)
    setCurrentItem({ ...emptyItem, isNew: true })
  }

  const handleEditItemClick = (item: BatchUpdateItemDto, index: number) => {
    setShowItemForm(true)

    // For existing items in the invoice
    const invoiceItem = invoice.items.find(i => i.id === item.id)

    if (invoiceItem) {
      setCurrentItem({
        id: invoiceItem.id,
        productId: invoiceItem.productId,
        quantity: item.quantity ?? invoiceItem.quantity,
        importPrice: item.importPrice ?? invoiceItem.importPrice,
        isNew: false,
        index
      })
    }
  }

  const handleCancelItem = () => {
    setShowItemForm(false)
  }

  const handleRemoveItem = (index: number) => {
    setFormData((prev: UpdateInvoiceWithItemsDto) => ({
      ...prev,
      items: prev.items?.filter((_, i: number) => i !== index) || []
    }))
  }

  const handleProductChange = (productId: string) => {
    const selectedProduct = products.find((p: ProductListData) => p.id === productId)

    setCurrentItem(prev => ({
      ...prev,
      productId,
      importPrice: prev.isNew ? selectedProduct?.price || 0 : prev.importPrice
    }))
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

  const handleSaveItem = () => {
    if (currentItem.isNew) {
      if (!currentItem.productId) {
        toast.error('Vui lòng chọn sản phẩm')
        return
      }

      // Add new item
      const newItem = {
        id: `temp-${Date.now()}`, // Temporary ID, will be replaced by backend
        productId: currentItem.productId,
        quantity: currentItem.quantity,
        importPrice: currentItem.importPrice
      }

      setFormData(prev => ({
        ...prev,
        items: [
          ...(prev.items || []),
          {
            id: newItem.id,
            quantity: newItem.quantity,
            importPrice: newItem.importPrice
          }
        ]
      }))
    } else {
      // Update existing item
      setFormData(prev => {
        const updatedItems = [...(prev.items || [])]
        const index = currentItem.index

        if (index !== undefined && index >= 0 && index < updatedItems.length) {
          updatedItems[index] = {
            id: currentItem.id,
            quantity: currentItem.quantity,
            importPrice: currentItem.importPrice
          }
        }

        return {
          ...prev,
          items: updatedItems
        }
      })
    }

    setShowItemForm(false)
  }

  const handleSubmit = () => {
    if (!formData.supplierId) {
      toast.error('Vui lòng chọn nhà cung cấp')
      return
    }

    if (!formData.items || formData.items.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm')
      return
    }

    updateInvoice({
      id: invoice.id,
      data: formData
    })
  }

  // Calculate total amount based on current items (both original and updated)
  const calculateTotal = () => {
    return (formData.items || []).reduce((sum: number, item: BatchUpdateItemDto) => {
      const originalItem = invoice.items.find(i => i.id === item.id)
      const quantity = typeof item.quantity === 'number' ? item.quantity : originalItem?.quantity || 0
      const price = typeof item.importPrice === 'number' ? item.importPrice : originalItem?.importPrice || 0
      return sum + quantity * price
    }, 0)
  }

  // Loading state
  const isLoading = isLoadingProducts || isLoadingSuppliers

  // Get product name from id
  const getProductName = (itemId: string) => {
    const invoiceItem = invoice.items.find(item => item.id === itemId)
    if (!invoiceItem) return 'Unknown Product'

    if (invoiceItem.product) return invoiceItem.product.name

    const product = products.find((p: ProductListData) => p.id === invoiceItem.productId)
    return product ? product.name : invoiceItem.productId
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EditIcon sx={{ mr: 1 }} />
          Chỉnh sửa hóa đơn
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
            <Box sx={{ mb: 3 }}>
              <Typography variant='subtitle1' color='text.secondary' gutterBottom>
                Mã hóa đơn: {invoice.id}
              </Typography>

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
                    {formData.items && formData.items.length > 0 ? (
                      formData.items.map((item, index) => {
                        const originalItem = invoice.items.find(i => i.id === item.id)
                        if (!originalItem) return null

                        const quantity = item.quantity ?? originalItem.quantity
                        const price = item.importPrice ?? originalItem.importPrice
                        const subtotal = quantity * price

                        return (
                          <TableRow key={item.id}>
                            <TableCell>{getProductName(item.id)}</TableCell>
                            <TableCell align='right'>{quantity}</TableCell>
                            <TableCell align='right'>{formatCurrency(price)}</TableCell>
                            <TableCell align='right'>{formatCurrency(subtotal)}</TableCell>
                            <TableCell align='center'>
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <IconButton size='small' color='primary' onClick={() => handleEditItemClick(item, index)}>
                                  <EditIcon fontSize='small' />
                                </IconButton>
                                <IconButton size='small' color='error' onClick={() => handleRemoveItem(index)}>
                                  <DeleteIcon fontSize='small' />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align='center'>
                          Chưa có sản phẩm nào. Vui lòng thêm sản phẩm.
                        </TableCell>
                      </TableRow>
                    )}
                    {formData.items && formData.items.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align='right' sx={{ fontWeight: 'bold' }}>
                          Tổng cộng:
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(calculateTotal())}
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Add/Edit Item Form */}
              {showItemForm ? (
                <Paper variant='outlined' sx={{ p: 2, mb: 2 }}>
                  <Typography variant='subtitle1' gutterBottom>
                    {currentItem.isNew ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    {currentItem.isNew && (
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
                    )}

                    {!currentItem.isNew && <TextField label='Sản phẩm' value={getProductName(currentItem.id)} disabled sx={{ minWidth: 200, flexGrow: 1 }} />}

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
                    <Button variant='contained' color='primary' onClick={handleSaveItem} disabled={currentItem.isNew && !currentItem.productId}>
                      Lưu
                    </Button>
                  </Box>
                </Paper>
              ) : (
                <Button variant='outlined' startIcon={<AddIcon />} onClick={handleAddItemClick} fullWidth sx={{ py: 1 }}>
                  Thêm sản phẩm mới
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
        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={isPending || !formData.items || formData.items.length === 0 || !formData.supplierId}
          startIcon={isPending ? <CircularProgress size={20} /> : null}
        >
          {isPending ? 'Đang cập nhật...' : 'Cập nhật hóa đơn'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
