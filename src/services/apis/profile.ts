import { UpdateProfileData } from "@/hooks/apis/profile";
import { UserData } from "@/hooks/apis/user";
import API from "@/services/axios";
import Endpoint from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";

// Get current user profile
export const fetchCurrentUserProfile = async (): Promise<BaseResponse<UserData>> => {
  const { data } = await API.get(Endpoint().profile.getProfile);
  return data;
};

// Update user avatar
export const fetchUpdateAvatar = async (formData: FormData): Promise<BaseResponse<UserData>> => {
  const { data } = await API.post(Endpoint().profile.uploadAvatar, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};


export const fetchUpdateProfile = async (updateData: UpdateProfileData): Promise<BaseResponse<UserData>> => {
  const { data } = await API.patch(Endpoint().profile.updateProfile, updateData);
  return data;
}; 