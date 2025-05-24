import { getAccessToken } from '@/utils/auth';
import { generateHeaders } from '@/utils/service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { deleteCookie } from 'cookies-next/client';

interface ApiResponse<T = unknown> {
  errorCode: number;
  message?: string;
  data: T;
}

interface ApiError {
  message: string;
  errorCode: number;
  data: unknown;
}

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

API.interceptors.request.use(
  async (config) => {
    // Skip setting default headers for multipart/form-data requests
    const contentType = config.headers['Content-Type'];
    const isMultipart = typeof contentType === 'string' && contentType.includes('multipart/form-data');

    if (!isMultipart) {
      const headers = await generateHeaders()
      Object.entries(headers).forEach(([key, value]) => {
        // Don't override content-type if it's already set in the request
        if (key.toLowerCase() !== 'content-type' || !config.headers['Content-Type']) {
          config.headers.set(key, value)
        }
      })
    } else {
      // For multipart requests, only set authorization
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.set('authorization', `Bearer ${accessToken}`);
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


// RESPONSE interceptor
API.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data as ApiResponse;

    if (data.errorCode !== 0) {
      return Promise.reject({
        message: data.message || 'Unknown error',
        errorCode: data.errorCode,
        data: data.data,
      } as ApiError);
    }

    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    console.error('Axios error:', error);

    // Handle unauthorized error
    if (error.response?.status === 401) {
      deleteCookie('accessToken');
    }
    // Handle API error response
    if (error.response?.data) {
      const { message, errorCode, data } = error.response.data;
      return Promise.reject({ message, errorCode, data } as ApiError);
    }

    // Handle other errors (network, timeout, etc.)
    return Promise.reject({
      message: error.message || 'Network Error',
      errorCode: -1,
      data: null,
    } as ApiError);
  }
);

export default API;