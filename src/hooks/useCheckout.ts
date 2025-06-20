import { useFetchAddressList, useFetchCreateAddress } from '@/hooks/apis/address'
import { useFetchGetCart } from '@/hooks/apis/cart'
import { DiscountData, DiscountType, useFetchGetDiscountByCode } from '@/hooks/apis/discount'
import { useFetchCreateOrder } from '@/hooks/apis/order'
import { CreateAddressPayload } from '@/types/address.type'
import { PaymentMethod } from '@/types/order.type'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

interface UseCheckoutReturn {
  // States
  orderState: {
    paymentMethod: PaymentMethod
    selectedAddressId: string
    useNewAddress: boolean
    note: string
  }
  discountState: {
    code: string
    data: DiscountData | null
    error: string
  }
  addressForm: CreateAddressPayload
  cartSubtotal: number
  discountAmount: number
  finalTotal: number
  isLoading: boolean
  isLoadingDiscount: boolean
  isSubmitting: boolean

  // Handlers
  handleAddressChange: (field: keyof CreateAddressPayload) => (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAddressSelection: (id: string) => void
  handleToggleNewAddress: (value: boolean) => void
  handleToggleDefault: () => void
  handleDiscountCodeChange: (value: string) => void
  handleApplyDiscount: () => void
  handleRemoveDiscount: () => void
  handlePaymentMethodChange: (value: PaymentMethod) => void
  handleNoteChange: (value: string) => void
  handleCheckout: () => void
}

export function useCheckout(): UseCheckoutReturn {
  const router = useRouter()

  // State for order details
  const [orderState, setOrderState] = useState({
    paymentMethod: PaymentMethod.CASH,
    selectedAddressId: '',
    useNewAddress: false,
    note: ''
  })

  // State for discount
  const [discountState, setDiscountState] = useState({
    code: '',
    data: null as DiscountData | null,
    error: ''
  })

  // State for new address form
  const [addressForm, setAddressForm] = useState<CreateAddressPayload>({
    fullName: '',
    phone: '',
    street: '',
    ward: '',
    district: '',
    city: ''
  })

  // API hooks
  const { data: cartData, isLoading: isLoadingCart } = useFetchGetCart()
  const { data: addressData, isLoading: isLoadingAddress } = useFetchAddressList()
  const { mutate: getDiscountByCode, isPending: isLoadingGetDiscountByCode } = useFetchGetDiscountByCode()
  const { mutate: createAddress, isPending: isLoadingCreateAddress } = useFetchCreateAddress()
  const { mutate: createOrder, isPending: isLoadingCreateOrder } = useFetchCreateOrder()

  // Auto switch to new address form if no addresses exist
  useEffect(() => {
    if (addressData?.data?.length === 0 || !addressData?.data) {
      setOrderState(prev => ({ ...prev, useNewAddress: true }))
    } else if (addressData?.data?.[0]?.id && !orderState.selectedAddressId) {
      setOrderState(prev => ({
        ...prev,
        selectedAddressId: addressData.data[0].id,
        useNewAddress: false
      }))
    }
  }, [addressData, orderState.selectedAddressId])

  // Calculate totals
  const cartSubtotal = cartData?.data?.items?.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0
  const { discountAmount, finalTotal } = useMemo(() => {
    let amount = 0
    const discount = discountState.data

    if (discount) {
      // Check minimum order requirement
      if (discount.minOrderTotal && cartSubtotal < discount.minOrderTotal) {
        setDiscountState(prev => ({
          ...prev,
          error: 'Đơn hàng không đạt điều kiện áp dụng mã giảm giá'
        }))
        return { discountAmount: 0, finalTotal: cartSubtotal }
      }

      // Calculate discount amount
      amount = discount.discountType === DiscountType.fixed ? discount.value : (cartSubtotal * discount.value) / 100

      // Apply maximum discount cap
      if (discount.maxDiscountValue && amount > discount.maxDiscountValue) {
        amount = discount.maxDiscountValue
      }
    }

    return {
      discountAmount: amount,
      finalTotal: cartSubtotal - amount
    }
  }, [discountState.data, cartSubtotal])

  // Handlers
  const handleAddressChange = (field: keyof CreateAddressPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleAddressSelection = (id: string) => {
    setOrderState(prev => ({
      ...prev,
      selectedAddressId: id,
      useNewAddress: false
    }))
  }

  const handleToggleNewAddress = (value: boolean) => {
    setOrderState(prev => ({
      ...prev,
      useNewAddress: value
    }))
  }

  const handleToggleDefault = () => {
    setAddressForm(prev => ({
      ...prev,
      isDefault: !prev.isDefault
    }))
  }

  const handleDiscountCodeChange = (value: string) => {
    setDiscountState(prev => ({
      ...prev,
      code: value,
      error: ''
    }))
  }

  const handleApplyDiscount = () => {
    if (!discountState.code) return
    setDiscountState(prev => ({ ...prev, error: '' }))

    getDiscountByCode(discountState.code, {
      onSuccess: data => {
        setDiscountState(prev => ({ ...prev, data: data.data }))
      },
      onError: error => {
        setDiscountState(prev => ({
          ...prev,
          data: null,
          error: error.message || 'Mã giảm giá không hợp lệ'
        }))
      }
    })
  }

  const handleRemoveDiscount = () => {
    setDiscountState({ code: '', data: null, error: '' })
  }

  const handlePaymentMethodChange = (value: PaymentMethod) => {
    setOrderState(prev => ({
      ...prev,
      paymentMethod: value
    }))
  }

  const handleNoteChange = (value: string) => {
    setOrderState(prev => ({
      ...prev,
      note: value
    }))
  }

  const handleCheckout = () => {
    const { selectedAddressId, useNewAddress, paymentMethod, note } = orderState

    if (!selectedAddressId && !useNewAddress) {
      toast.error('Vui lòng chọn địa chỉ', { position: 'top-center' })
      return
    }

    const createOrderWithAddress = (addressId: string) => {
      createOrder(
        {
          addressId,
          paymentMethod,
          discountCode: discountState.data?.code,
          note: note || undefined
        },
        {
          onSuccess: data => {
            toast.success('Đặt hàng thành công', { position: 'top-center' })
            if (data.data?.paymentMethod === PaymentMethod.VNPAY) {
              if (data.data?.paymentUrl) {
                router.push(data.data.paymentUrl)
              }
            } else {
              router.push(`/profile`)
            }
          },
          onError: error => {
            toast.error(error.message || 'Không thể tạo đơn hàng', { position: 'top-center' })
          }
        }
      )
    }

    if (useNewAddress) {
      createAddress(addressForm, {
        onSuccess: data => {
          const newAddressId = data?.data?.id
          if (!newAddressId) {
            toast.error('Không thể tạo địa chỉ', { position: 'top-center' })
            return
          }
          createOrderWithAddress(newAddressId)
        },
        onError: error => {
          toast.error(error.message || 'Không thể tạo địa chỉ', { position: 'top-center' })
        }
      })
    } else {
      createOrderWithAddress(selectedAddressId)
    }
  }

  return {
    // States
    orderState,
    discountState,
    addressForm,
    cartSubtotal,
    discountAmount,
    finalTotal,
    isLoading: isLoadingCart || isLoadingAddress,
    isLoadingDiscount: isLoadingGetDiscountByCode,
    isSubmitting: isLoadingCreateAddress || isLoadingCreateOrder,

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
  }
} 