'use client'

import { useFetchVerifyReturnUrl } from '@/hooks/apis/order'
import { BaseResponse } from '@/types/base-response'
import { ResponseVerifyReturnUrl, VNPayReturnParams } from '@/types/order.type'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function VNPayReturnClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'processing'>('processing')
  const [verificationResult, setVerificationResult] = useState<ResponseVerifyReturnUrl | null>(null)

  // Add error handler for VNPay sandbox errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Check if the error is from VNPay sandbox timer
      if (event.message.includes('timer is not defined') && event.filename?.includes('vnpayment.vn')) {
        // Prevent the error from showing in console
        event.preventDefault()
        return true
      }
      return false
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  const { vnpParams, txnRef } = useMemo(() => {
    const params: VNPayReturnParams = {
      vnp_Amount: searchParams?.get('vnp_Amount') || '',
      vnp_BankCode: searchParams?.get('vnp_BankCode') || '',
      vnp_BankTranNo: searchParams?.get('vnp_BankTranNo') || '',
      vnp_CardType: searchParams?.get('vnp_CardType') || '',
      vnp_OrderInfo: searchParams?.get('vnp_OrderInfo') || '',
      vnp_PayDate: searchParams?.get('vnp_PayDate') || '',
      vnp_TmnCode: searchParams?.get('vnp_TmnCode') || '',
      vnp_TransactionNo: searchParams?.get('vnp_TransactionNo') || '',
      vnp_TxnRef: searchParams?.get('vnp_TxnRef') || '',
      vnp_SecureHash: searchParams?.get('vnp_SecureHash') || '',
      vnp_ResponseCode: searchParams?.get('vnp_ResponseCode') || '',
      vnp_TransactionStatus: searchParams?.get('vnp_TransactionStatus') || ''
    }
    return {
      vnpParams: params,
      txnRef: params.vnp_TxnRef
    }
  }, [searchParams])

  const getCachedResult = useCallback(() => {
    if (txnRef) {
      const cached = localStorage.getItem(`vnpay_verify_${txnRef}`)
      if (cached) {
        try {
          return JSON.parse(cached) as ResponseVerifyReturnUrl
        } catch (e) {
          console.error('Error parsing cached result:', e)
        }
      }
    }
    return null
  }, [txnRef])

  const { mutate: verifyReturnUrl, isPending } = useFetchVerifyReturnUrl({
    onSuccess: (response: BaseResponse<ResponseVerifyReturnUrl>) => {
      const data = response.data
      setVerificationResult(data)

      const isSuccess = data?.isVerified && data?.isSuccess
      setPaymentStatus(isSuccess ? 'success' : 'failed')

      if (txnRef) {
        localStorage.setItem(`vnpay_verify_${txnRef}`, JSON.stringify(data))
        if (isSuccess) {
          localStorage.setItem(`vnpay_${txnRef}`, 'true')
        }
      }
    },
    onError: error => {
      console.error('Verify error:', error)
      setPaymentStatus('failed')
    }
  })

  // Add function to check for timeout error
  const isTimeoutError = (message: string | undefined) => {
    return message?.includes('quá thời gian chờ thanh toán') || 
           message?.includes('transaction has expired')
  }

  useEffect(() => {
    if (!vnpParams.vnp_TxnRef) {
      setPaymentStatus('failed')
      return
    }

    const cachedResult = getCachedResult()
    if (cachedResult) {
      setVerificationResult(cachedResult)
      const isSuccess = cachedResult.isVerified && cachedResult.isSuccess
      setPaymentStatus(isSuccess ? 'success' : 'failed')
      return
    }

    verifyReturnUrl(vnpParams)
  }, [vnpParams, verifyReturnUrl, getCachedResult])

  const handleBackToHome = () => {
    router.replace('/')
  }

  const handleViewOrder = () => {
    router.replace('/profile')
  }

  const renderContent = () => {
    if (paymentStatus === 'processing' || isPending) {
      return (
        <>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant='h5' gutterBottom>
            Đang xác thực thanh toán...
          </Typography>
        </>
      )
    }

    if (paymentStatus === 'success') {
      return (
        <>
          <CheckCircleIcon color='success' sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant='h5' gutterBottom color='success.main'>
            Thanh Toán Thành Công!
          </Typography>
          <Typography variant='body1' color='text.secondary' paragraph>
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant='contained' onClick={handleViewOrder}>
              Xem Đơn Hàng
            </Button>
            <Button variant='outlined' onClick={handleBackToHome}>
              Về Trang Chủ
            </Button>
          </Box>
        </>
      )
    }

    // Handle timeout error specifically
    const errorMessage = verificationResult?.message
    const isTimeout = isTimeoutError(errorMessage)

    return (
      <>
        <ErrorIcon color='error' sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant='h5' gutterBottom color='error.main'>
          {isTimeout ? 'Hết Thời Gian Thanh Toán' : 'Thanh Toán Thất Bại'}
        </Typography>
        <Typography variant='body1' color='text.secondary' paragraph>
          {isTimeout 
            ? 'Giao dịch đã hết thời gian chờ thanh toán. Vui lòng thực hiện lại giao dịch.'
            : errorMessage || 'Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.'}
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
          {isTimeout && (
            <Button 
              variant='contained' 
              onClick={() => router.push('/checkout')}
              sx={{ minWidth: 200 }}
            >
              Thực Hiện Lại Thanh Toán
            </Button>
          )}
          <Button variant='outlined' onClick={handleBackToHome}>
            Về Trang Chủ
          </Button>
        </Box>
      </>
    )
  }

  return (
    <Box sx={{ py: 4, maxWidth: 600, mx: 'auto' }}>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>{renderContent()}</CardContent>
      </Card>
    </Box>
  )
}
