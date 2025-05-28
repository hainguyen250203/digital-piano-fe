import { UserData } from '@/hooks/apis/user'
import { BaseResponse } from '@/types/base-response'
import { useEffect, useRef, useState } from 'react'

interface UseProfileActionsProps {
  profileData: BaseResponse<UserData> | undefined
  onUpdateProfile: (data: { phoneNumber: string | undefined }) => void
  onUpdateAvatar: (formData: FormData) => void
  isUpdatingProfile: boolean
  isUpdatingAvatar: boolean
}

export function useProfileActions({
  profileData,
  onUpdateProfile,
  onUpdateAvatar,
  isUpdatingProfile,
  isUpdatingAvatar
}: UseProfileActionsProps) {
  // Profile state
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined)
  const [isEditing, setIsEditing] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const wasUpdating = useRef(false)

  // Profile effects and handlers
  useEffect(() => {
    if (profileData?.data) {
      setPhoneNumber(profileData.data.phoneNumber || undefined)
    }
  }, [profileData])

  // Exit edit mode when updates are complete
  useEffect(() => {
    // If we were updating and now updates are complete
    if (wasUpdating.current && !isUpdatingProfile && !isUpdatingAvatar) {
      setIsEditing(false)
      wasUpdating.current = false
    }

    // Track if we're updating
    if (isUpdatingProfile || isUpdatingAvatar) {
      wasUpdating.current = true
    }
  }, [isUpdatingProfile, isUpdatingAvatar])

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (profileData?.data) {
      setPhoneNumber(profileData.data.phoneNumber || undefined)
    }
    setAvatarFile(null)
    setPreviewUrl(null)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setAvatarFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Track if any updates were initiated
    let updatesInitiated = false

    // Only call onUpdateProfile if the phone number has changed and is not empty string or undefined
    const hasValidPhoneNumber = phoneNumber !== undefined && phoneNumber !== '' && phoneNumber !== null
    const phoneNumberChanged = profileData?.data && phoneNumber !== profileData.data.phoneNumber

    if (hasValidPhoneNumber && phoneNumberChanged) {
      onUpdateProfile({ phoneNumber })
      updatesInitiated = true
    }

    // Always process avatar update if a new file is selected, regardless of phone number
    if (avatarFile) {
      const formData = new FormData()
      formData.append('file', avatarFile)
      onUpdateAvatar(formData)
      updatesInitiated = true
    }

    // If no updates were initiated, just exit edit mode
    if (!updatesInitiated) {
      setIsEditing(false)
    }
  }

  return {
    // State
    phoneNumber,
    isEditing,
    avatarFile,
    previewUrl,
    
    // Handlers
    setPhoneNumber,
    handleStartEdit,
    handleCancelEdit,
    handleAvatarChange,
    handleSubmit
  }
} 