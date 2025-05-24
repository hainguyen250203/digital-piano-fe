export interface BaseResponse<T> {
  errorCode: number;
  message: string;
  data: T | null;
}

