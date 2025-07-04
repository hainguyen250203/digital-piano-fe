import { formatCurrency } from '@/utils/format'
import ClearIcon from '@mui/icons-material/Clear'
import { Box, Button, Card, CardContent, CircularProgress, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'

interface OrderSummarySectionProps {
  cartSubtotal: number
  discountAmount: number
  finalTotal: number
  discountCode: string
  discountError: string
  isLoadingDiscount: boolean
  onDiscountCodeChange: (value: string) => void
  onApplyDiscount: () => void
  onRemoveDiscount: () => void
}

export default function OrderSummarySection({
  cartSubtotal,
  discountAmount,
  finalTotal,
  discountCode,
  discountError,
  isLoadingDiscount,
  onDiscountCodeChange,
  onApplyDiscount,
  onRemoveDiscount
}: OrderSummarySectionProps) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant='h5' fontWeight={600} gutterBottom>
          Đơn Hàng
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Discount Code Input */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label='Mã giảm giá'
            variant='outlined'
            value={discountCode}
            onChange={e => onDiscountCodeChange(e.target.value)}
            disabled={!!discountAmount || isLoadingDiscount}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  {discountAmount ? (
                    <IconButton onClick={onRemoveDiscount} disabled={isLoadingDiscount}>
                      <ClearIcon />
                    </IconButton>
                  ) : (
                    <Button 
                      variant='contained' 
                      size='small' 
                      onClick={onApplyDiscount} 
                      disabled={isLoadingDiscount || !discountCode}
                      startIcon={isLoadingDiscount ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                      {isLoadingDiscount ? 'Đang áp dụng...' : 'Áp dụng'}
                    </Button>
                  )}
                </InputAdornment>
              )
            }}
          />
          {discountError && (
            <Typography color='error' variant='body2' sx={{ mt: 1 }}>
              {discountError}
            </Typography>
          )}
        </Box>

        {/* Order Totals */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Tạm tính</Typography>
            <Typography variant="body2">{formatCurrency(cartSubtotal)}</Typography>
          </Box>
          {discountAmount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Giảm giá</Typography>
              <Typography variant="body2" color='error'>- {formatCurrency(discountAmount)}</Typography>
            </Box>
          )}
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='subtitle1' fontWeight={600}>Tổng cộng</Typography>
            <Typography variant='subtitle1' fontWeight={600} color='primary'>
              {formatCurrency(finalTotal)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
} 