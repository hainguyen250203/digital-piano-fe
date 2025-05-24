import { UserData } from "@/hooks/apis/user";
import { QueryKey } from "@/models/QueryKey";
import { fetchCurrentUserProfile, fetchUpdateAvatar, fetchUpdateProfile } from "@/services/apis/profile";
import { BaseResponse } from "@/types/base-response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ProfileResponse {
  email: string;
  avatarUrl: string;
  phoneNumber: string;
  role: string;
}

// Update user profile
export interface UpdateProfileData {
  phoneNumber?: string;
}

// Get current user profile
export const useFetchCurrentUserProfile = () => {
  return useQuery<BaseResponse<UserData>, Error>({
    queryKey: [QueryKey.USER_PROFILE],
    queryFn: () => fetchCurrentUserProfile(),
  });
};

// Update user avatar
export const useFetchUpdateAvatar = (options?: {
  onSuccess?: (data: BaseResponse<ProfileResponse>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => fetchUpdateAvatar(formData),
    onSuccess: (data: BaseResponse<UserData>) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.USER_PROFILE] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error | BaseResponse<null>) => {
      if (options?.onError) {
        options.onError({
          message: 'message' in error ? error.message : 'Failed to update avatar',
          errorCode: 'errorCode' in error ? error.errorCode as number : 500,
          data: null
        });
      }
    }
  });
};

// Update user profile
export const useFetchUpdateProfile = (options?: {
  onSuccess?: (data: BaseResponse<UserData>) => void;
  onError?: (error: BaseResponse<null>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileData) => fetchUpdateProfile(data),
    onSuccess: (data: BaseResponse<UserData>) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.USER_PROFILE] });
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error | BaseResponse<null>) => {
      if (options?.onError) {
        options.onError({
          message: 'message' in error ? error.message : 'Failed to update profile',
          errorCode: 'errorCode' in error ? error.errorCode as number : 500,
          data: null
        });
      }
    }
  });
};