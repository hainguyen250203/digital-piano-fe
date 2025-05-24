import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

interface DeleteConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  isDeleting?: boolean
  confirmButtonText?: string
  confirmButtonColor?: 'error' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'inherit'
}

export default function DeleteConfirmationDialog({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isDeleting = false,
  confirmButtonText = 'Xóa',
  confirmButtonColor = 'error'
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-confirmation-dialog-title"
      aria-describedby="delete-confirmation-dialog-description"
    >
      <DialogTitle id="delete-confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={isDeleting}>
          Hủy
        </Button>
        <Button onClick={onConfirm} color={confirmButtonColor} autoFocus disabled={isDeleting}>
          {isDeleting ? `Đang ${confirmButtonText.toLowerCase()}...` : confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
} 