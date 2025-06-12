import API from "@/services/axios";
import Endpoint from "@/services/endpoint";
import { BaseResponse } from "@/types/base-response";

export type SignUpData = {
  email: string;
  password: string;
  phoneNumber?: string;
}

export type LoginData = {
  email: string;
  password: string;
}

export type RequestOtpData = {
  email: string;
}

export type VerifyLoginOtpData = {
  email: string;
  otp: string;
  otpSecret: string;
}

export type VerifyForgotPasswordOtpData = {
  email: string;
  otp: string;
  otpSecret: string;
  newPassword: string;
}

export type ResponseLoginOtp = {
  accessToken: string;
  role: string;
}

export type ResponseRequestLoginOtp = {
  otpSecret: string;
}

export const fetchSignUp = async (signUpData: SignUpData): Promise<BaseResponse<ResponseLoginOtp>> => {
  const { data } = await API.post(Endpoint().auth.signUp, signUpData);
  return data;
};

export const fetchLogin = async (loginData: LoginData) => {
  const { data } = await API.post(Endpoint().auth.login, loginData);
  return data;
};

export const fetchRequestLoginOtp = async (requestData: RequestOtpData): Promise<BaseResponse<ResponseRequestLoginOtp>> => {
  const { data } = await API.post(Endpoint().auth.requestLoginOtp, requestData);
  return data;
};

export const fetchVerifyLoginOtp = async (verifyData: VerifyLoginOtpData): Promise<BaseResponse<ResponseLoginOtp>> => {
  const { data } = await API.post(Endpoint().auth.verifyLoginOtp, verifyData);
  return data;
};

export const fetchRequestForgotPasswordOtp = async (requestData: RequestOtpData) => {
  const { data } = await API.post(Endpoint().auth.requestForgotPasswordOtp, requestData);
  return data;
};

export const fetchVerifyForgotPasswordOtp = async (verifyData: VerifyForgotPasswordOtpData): Promise<BaseResponse<ResponseLoginOtp>> => {
  const { data } = await API.post(Endpoint().auth.verifyForgotPasswordOtp, verifyData);
  return data;
};


