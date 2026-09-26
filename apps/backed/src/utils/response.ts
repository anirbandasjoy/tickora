import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface SuccessPayload<T> {
  statusCode?: number;
  message?: string;
  data?: T;
}

export function sendSuccessResponse<T>(res: Response, payload: SuccessPayload<T>) {
  const { statusCode = StatusCodes.OK, message = 'Success', data = null } = payload;
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
}

interface ErrorPayload {
  statusCode?: number;
  message?: string;
  error?: unknown;
}

export function sendErrorResponse(res: Response, payload: ErrorPayload) {
  const {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    message = 'Something went wrong',
    error,
  } = payload;
  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(error !== undefined ? { error } : {}),
  });
}
