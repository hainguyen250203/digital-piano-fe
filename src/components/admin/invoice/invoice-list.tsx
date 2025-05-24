import DeleteConfirmationDialog from '@/components/admin/common/delete-confirmation-dialog'
import CreateInvoiceModal from '@/components/admin/invoice/create-invoice-modal'
import EditInvoiceModal from '@/components/admin/invoice/edit-invoice-modal'
import ViewInvoiceModal from '@/components/admin/invoice/view-invoice-modal'
import { InvoiceData, useFetchDeleteInvoice, useFetchInvoiceList } from '@/hooks/apis/invoice'
import { formatCurrency, formatDate } from '@/utils/format'
import AddIcon from '@mui/icons-material/Add'
import InventoryIcon from '@mui/icons-material/Inventory'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function InvoiceList() {
  // Fetch invoices
  const { data: invoiceData, isLoading, refetch } = useFetchInvoiceList()
  const invoices = invoiceData?.data || []

  // Delete invoice mutation
  const { mutate: deleteInvoice, isPending: isDeleteInvoicePending } = useFetchDeleteInvoice({
    onSuccess: () => {
      toast.success('Xóa hóa đơn thành công')
      setIsDeleteDialogOpen(false)
      refetch()
    },
    onError: error => {
      toast.error(error.message || 'Xóa hóa đơn thất bại')
    }
  })

  // State for search and pagination
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // State for modals
  const [createInvoiceModalOpen, setCreateInvoiceModalOpen] = useState(false)
  const [editInvoiceModalOpen, setEditInvoiceModalOpen] = useState(false)
  const [viewInvoiceModalOpen, setViewInvoiceModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)

  // Reset pagination when search changes
  useEffect(() => {
    setPage(0)
  }, [searchQuery])

  // Refresh data when modals close
  useEffect(() => {
    if (!createInvoiceModalOpen && !editInvoiceModalOpen) {
      refetch()
    }
  }, [createInvoiceModalOpen, editInvoiceModalOpen, refetch])

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice => invoice && invoice.supplier && invoice.supplier.name && invoice.supplier.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleView = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice)
    setViewInvoiceModalOpen(true)
  }

  const handleEdit = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice)
    setEditInvoiceModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setInvoiceToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleCloseViewModal = () => {
    setViewInvoiceModalOpen(false)
    setTimeout(() => {
      setSelectedInvoice(null)
    }, 300)
  }

  const handleCloseEditModal = () => {
    setEditInvoiceModalOpen(false)
    setTimeout(() => {
      setSelectedInvoice(null)
    }, 300)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (invoiceToDelete) {
      deleteInvoice(invoiceToDelete)
    }
  }

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
        <Typography variant='h5'>Quản lý hóa đơn</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder='Tìm kiếm nhà cung cấp...'
            variant='outlined'
            size='small'
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 250 }}
          />
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => setCreateInvoiceModalOpen(true)}>
            Tạo hóa đơn
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table sx={{ minWidth: 650 }} aria-label='invoice table' stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Mã hóa đơn</TableCell>
                <TableCell>Nhà cung cấp</TableCell>
                <TableCell align='right'>Tổng tiền</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align='center'>Số mặt hàng</TableCell>
                <TableCell align='center' width='280px'>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    {searchQuery ? 'Không tìm thấy hóa đơn phù hợp' : 'Không có hóa đơn nào'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(invoice => (
                  <TableRow hover key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.supplier?.name || 'Nhà cung cấp không xác định'}</TableCell>
                    <TableCell align='right'>{formatCurrency(invoice.totalAmount)}</TableCell>
                    <TableCell>{formatDate(new Date(invoice.createdAt))}</TableCell>
                    <TableCell align='center'>
                      <Stack direction='row' spacing={0.5} alignItems='center' justifyContent='center'>
                        <InventoryIcon fontSize='small' color='action' />
                        <Typography variant='body2'>{invoice.items?.length || 0}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align='center'>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button variant='contained' color='info' size='small' onClick={() => handleView(invoice)}>
                          Xem
                        </Button>
                        <Button variant='contained' color='primary' size='small' onClick={() => handleEdit(invoice)}>
                          Sửa
                        </Button>
                        <Button variant='contained' color='error' size='small' onClick={() => handleDelete(invoice.id)}>
                          Xóa
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component='div'
          count={filteredInvoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Modals */}
      <CreateInvoiceModal open={createInvoiceModalOpen} onClose={() => setCreateInvoiceModalOpen(false)} />

      {selectedInvoice && (
        <>
          <ViewInvoiceModal open={viewInvoiceModalOpen} onClose={handleCloseViewModal} invoice={selectedInvoice} />

          <EditInvoiceModal open={editInvoiceModalOpen} onClose={handleCloseEditModal} invoice={selectedInvoice} />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title='Xóa hóa đơn'
        message='Bạn có chắc chắn muốn xóa hóa đơn này? Hành động này không thể hoàn tác.'
        isDeleting={isDeleteInvoicePending}
      />
    </>
  )
}
