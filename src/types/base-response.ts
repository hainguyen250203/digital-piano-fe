export interface BaseResponse<T> {
  errorCode: number;
  message: string;
  data: T;
}

export interface BaseResponseError {
  errorCode: number;
  message: string;
  data: null;
}