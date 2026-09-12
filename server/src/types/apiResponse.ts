export interface ApiSuccessResponse<T = any> {
  success: true;
  message?: string;
  data: T;
  meta?: Record<string, any>;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export const createSuccessResponse = <T>(
  data: T,
  message?: string,
  meta?: Record<string, any>
): ApiSuccessResponse<T> => ({
  success: true,
  ...(message ? { message } : {}),
  data,
  ...(meta ? { meta } : {}),
  timestamp: new Date().toISOString(),
});

export const createErrorResponse = (
  code: string,
  message: string,
  details?: any
): ApiErrorResponse => ({
  success: false,
  error: {
    code,
    message,
    ...(details ? { details } : {}),
  },
  timestamp: new Date().toISOString(),
});
