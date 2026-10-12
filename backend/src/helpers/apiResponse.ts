import { Response } from 'express';

interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  success?: boolean;
  message: string;
  data?: T;
  meta?: any;
}

export function apiResponse<T>({
  res,
  statusCode = 200,
  success = true,
  message,
  data,
  meta,
}: ApiResponseOptions<T>): Response {
  return res.status(statusCode).json({
    success,
    message,
    data: data ?? null,
    ...(meta ? { meta } : {}),
  });
}

export function errorResponse(
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    ...(errors ? { errors } : {}),
  });
}
