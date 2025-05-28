import { useFetchCreateAddress, useFetchDeleteAddress, useFetchSetDefaultAddress, useFetchUpdateAddress } from '@/hooks/apis/address'
import { CreateAddressPayload, ResponseAddress, UpdateAddressPayload } from '@/types/address.type'
import { useState } from 'react'

interface UseAddressActionsProps {
  onAddressChanged: () => void
}

export function useAddressActions({ onAddressChanged }: UseAddressActionsProps) {
  const [openAddressDialog, setOpenAddressDialog] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<ResponseAddress | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(3)

  // Create address
  const { mutate: createAddress, isPending: isCreatingAddress } = useFetchCreateAddress({
    onSuccess: () => {
      onAddressChanged()
      handleCloseAddressDialog()
    },
    onError: error => {
      console.error(error.message, 'lỗi khi tạo địa chỉ mới')
    }
  })

  // Update address
  const { mutate: updateAddress, isPending: isUpdatingAddress } = useFetchUpdateAddress({
    onSuccess: () => {
      onAddressChanged()
      handleCloseAddressDialog()
    },
    onError: error => {
      console.error(error.message, 'lỗi khi cập nhật địa chỉ')
    }
  })

  // Delete address
  const { mutate: deleteAddress, isPending: isDeletingAddress } = useFetchDeleteAddress({
    onSuccess: () => {
      onAddressChanged()
    },
    onError: error => {
      console.error(error.message, 'lỗi khi xóa địa chỉ')
    }
  })

  // Set default address
  const { mutate: setDefaultAddress, isPending: isSettingDefaultAddress } = useFetchSetDefaultAddress({
    onSuccess: () => {
      onAddressChanged()
    },
    onError: error => {
      console.error(error.message, 'lỗi khi đặt địa chỉ mặc định')
    }
  })

  // Dialog handlers
  const handleOpenAddressDialog = (address: ResponseAddress | null = null) => {
    setCurrentAddress(address)
    setOpenAddressDialog(true)
  }

  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false)
    setCurrentAddress(null)
  }

  // Save address handler
  const handleSaveAddress = (data: CreateAddressPayload | UpdateAddressPayload) => {
    if (currentAddress) {
      updateAddress({
        id: currentAddress.id,
        ...data
      } as UpdateAddressPayload)
    } else {
      createAddress(data as CreateAddressPayload)
    }
  }

  // Delete address handler
  const handleDeleteAddress = (id: string) => {
    deleteAddress(id)
  }

  // Set default address handler
  const handleSetDefaultAddress = (id: string) => {
    setDefaultAddress(id)
  }
  
  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return {
    // State
    openAddressDialog,
    currentAddress,
    page,
    rowsPerPage,
    
    // Status
    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isSettingDefaultAddress,
    
    // Handlers
    handleOpenAddressDialog,
    handleCloseAddressDialog,
    handleSaveAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
    handleChangePage,
    handleChangeRowsPerPage
  }
} 