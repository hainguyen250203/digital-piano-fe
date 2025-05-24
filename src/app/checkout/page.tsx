'use client'

import AddressSection from '@/components/checkout/AddressSection'
import CheckoutSkeleton from '@/components/checkout/CheckoutSkeleton'
import OrderSummarySection from '@/components/checkout/OrderSummarySection'
import PaymentMethodSection from '@/components/checkout/PaymentMethodSection'
import ProductsSection from '@/components/checkout/ProductsSection'
import { useFetchAddressList } from '@/hooks/apis/address'
import { useFetchGetCart } from '@/hooks/apis/cart'
import { useCheckout } from '@/hooks/useCheckout'
import { Box, Button, Card, CardContent, Divider, Grid, TextField, Typography } from '@mui/material'

export default function CheckoutPage() {
  const { data: cartData } = useFetchGetCart()
  const { data: addressData } = useFetchAddressList()
  const {
    // States
    orderState,
    discountState,
    addressForm,
    cartSubtotal,
    discountAmount,
    finalTotal,
    isLoading,
    isLoadingDiscount,
    isSubmitting,

    // Handlers
    handleAddressChange,
    handleAddressSelection,
    handleToggleNewAddress,
    handleToggleDefault,
    handleDiscountCodeChange,
    handleApplyDiscount,
    handleRemoveDiscount,
    handlePaymentMethodChange,
    handleNoteChange,
    handleCheckout
  } = useCheckout()

  if (isLoading) {
    return <CheckoutSkeleton />
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Thanh Toán
      </Typography>

      <Grid container spacing={4}>
        {/* Left side - Products and Address */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Products Section */}
          <ProductsSection items={cartData?.data?.items || []} />

          {/* Address Section */}
          <AddressSection
            addresses={addressData?.data || []}
            selectedAddressId={orderState.selectedAddressId}
            useNewAddress={orderState.useNewAddress}
            addressForm={addressForm}
            onAddressChange={handleAddressChange}
            onAddressSelection={handleAddressSelection}
            onToggleNewAddress={handleToggleNewAddress}
            onToggleDefault={handleToggleDefault}
          />
        </Grid>

        {/* Right side - Order Summary and Payment */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Order Summary */}
          <OrderSummarySection
            cartSubtotal={cartSubtotal}
            discountAmount={discountAmount}
            finalTotal={finalTotal}
            discountCode={discountState.code}
            discountError={discountState.error}
            isLoadingDiscount={isLoadingDiscount}
            onDiscountCodeChange={handleDiscountCodeChange}
            onApplyDiscount={handleApplyDiscount}
            onRemoveDiscount={handleRemoveDiscount}
          />

          {/* Payment Method */}
          <PaymentMethodSection paymentMethod={orderState.paymentMethod} onPaymentMethodChange={handlePaymentMethodChange} />

          {/* Note */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Ghi Chú Đơn Hàng
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField
                fullWidth
                multiline
                rows={3}
                label='Ghi chú'
                variant='outlined'
                placeholder='Thông tin thêm về đơn hàng của bạn'
                value={orderState.note}
                onChange={e => handleNoteChange(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Place Order Button */}
          <Button
            variant='contained'
            color='primary'
            size='large'
            fullWidth
            disabled={(!orderState.selectedAddressId && !orderState.useNewAddress) || isSubmitting}
            sx={{
              py: 1.5,
              fontSize: '1.1rem'
            }}
            onClick={handleCheckout}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đặt Hàng'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
