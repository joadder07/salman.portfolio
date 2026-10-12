import { Request, Response, NextFunction } from 'express';
import { AppError } from '../helpers/errors';

/**
 * Global error handling middleware.
 * Catches all errors thrown in route handlers and sends a standardized JSON response.
 */
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Log non-operational (unexpected) errors
  if (!isOperational) {
    console.error('💥 Unexpected Error:', err);
  }

  // In development, include stack trace
  const isDev = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    ...(isDev && { stack: err.stack }),
  });
};
