import VNPayReturnClient from '@/components/vnpay/VNPayReturnClient'
import { Suspense } from 'react'

export default function VNPayReturnPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VNPayReturnClient />
    </Suspense>
  )
}
