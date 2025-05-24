import type { LoginData, ResponseLoginOtp, ResponseRequestLoginOtp, SignUpData, VerifyLoginOtpData } from "@/services/apis/auth";
import { fetchLogin, fetchRequestLoginOtp, fetchSignUp, fetchVerifyLoginOtp } from "@/services/apis/auth";
import { BaseResponse } from '@/types/base-response';
import { useMutation } from '@tanstack/react-query';

export interface LoginResult {
  accessToken: string;
  role: string;
}



export const useFetchLogin = (options?: {
  onSuccess: (data: BaseResponse<ResponseLoginOtp>) => void;
  onError: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (data: LoginData) => fetchLogin(data),
    ...options,
  })
}


export const useFetchSignup = (options?: {
  onSuccess: (data: BaseResponse<ResponseLoginOtp>) => void;
  onError: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (data: SignUpData) => fetchSignUp(data),
    ...options,
  });
}

export const useFetchRequestLoginOtp = (options?: {
  onSuccess: (data: BaseResponse<ResponseRequestLoginOtp>) => void;
  onError: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (email: string) => fetchRequestLoginOtp({ email }),
    ...options,
  });
}

export const useFetchVerifyLoginOtp = (options?: {
  onSuccess: (data: BaseResponse<ResponseLoginOtp>) => void;
  onError: (error: BaseResponse<null>) => void;
}) => {
  return useMutation({
    mutationFn: (data: VerifyLoginOtpData) => fetchVerifyLoginOtp(data),
    ...options,
  });
} 
