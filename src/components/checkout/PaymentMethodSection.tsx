import { PaymentMethod } from '@/types/order.type'
import { Card, CardContent, Divider, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (value: PaymentMethod) => void
}

export default function PaymentMethodSection({ paymentMethod, onPaymentMethodChange }: PaymentMethodSectionProps) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Phương Thức Thanh Toán
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <RadioGroup value={paymentMethod} onChange={e => onPaymentMethodChange(e.target.value as PaymentMethod)}>
          <FormControlLabel value={PaymentMethod.VNPAY} control={<Radio />} label='VNPay' />
          <FormControlLabel value={PaymentMethod.CASH} control={<Radio />} label='Thanh toán khi nhận hàng' />
        </RadioGroup>
      </CardContent>
    </Card>
  )
} 