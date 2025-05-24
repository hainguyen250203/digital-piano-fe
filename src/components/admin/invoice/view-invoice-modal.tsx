import { InvoiceData } from '@/hooks/apis/invoice'
import { formatCurrency, formatDate } from '@/utils/format'
import CloseIcon from '@mui/icons-material/Close'
import ReceiptIcon from '@mui/icons-material/Receipt'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

export interface ViewInvoiceModalProps {
  open: boolean
  onClose: () => void
  invoice?: InvoiceData
}

export default function ViewInvoiceModal({ open, onClose, invoice }: ViewInvoiceModalProps) {
  if (!invoice) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptIcon sx={{ mr: 1 }} />
          Chi tiết hóa đơn
        </Box>
        <IconButton aria-label='close' onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant='subtitle2' color='text.secondary'>Mã hóa đơn</Typography>
              <Typography variant='body1'>{invoice.id}</Typography>
            </Box>
            <Box>
              <Typography variant='subtitle2' color='text.secondary'>Ngày</Typography>
              <Typography variant='body1'>{formatDate(new Date(invoice.createdAt))}</Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle2' color='text.secondary'>Nhà cung cấp</Typography>
            <Typography variant='body1'>{invoice.supplier?.name || 'Nhà cung cấp không xác định'}</Typography>
          </Box>

          {invoice.note && (
            <Box sx={{ mb: 2 }}>
              <Typography variant='subtitle2' color='text.secondary'>Ghi chú</Typography>
              <Typography variant='body1'>{invoice.note}</Typography>
            </Box>
          )}
        </Paper>

        <Typography variant='h6' gutterBottom>
          Sản phẩm
        </Typography>

        <TableContainer component={Paper} variant='outlined' sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell align='right'>Số lượng</TableCell>
                <TableCell align='right'>Giá nhập</TableCell>
                <TableCell align='right'>Thành tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.product?.name || item.productId}</TableCell>
                  <TableCell align='right'>{item.quantity}</TableCell>
                  <TableCell align='right'>{formatCurrency(item.importPrice)}</TableCell>
                  <TableCell align='right'>{formatCurrency(item.subtotal)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} align='right' sx={{ fontWeight: 'bold' }}>
                  Tổng cộng:
                </TableCell>
                <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(invoice.totalAmount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
} 