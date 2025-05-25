import { CreateAddressPayload, UpdateAddressPayload } from '@/types/address.type'
import { useState } from 'react'

interface UseAddressFormProps {
  onSubmit: (data: CreateAddressPayload | UpdateAddressPayload) => void
  initialData?: {
    fullName: string
    phone: string
    street: string
    ward: string
    district: string
    city: string
    isDefault: boolean
  }
}

export function useAddressForm({ onSubmit, initialData }: UseAddressFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSubmit = async (data: CreateAddressPayload | UpdateAddressPayload) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      handleClose()
    } catch (error) {
      console.error('Error submitting address:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    open,
    handleOpen,
    handleClose,
    handleSubmit,
    isSubmitting,
    initialData
  }
} 