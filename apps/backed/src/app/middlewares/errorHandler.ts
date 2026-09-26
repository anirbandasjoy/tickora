import type { ErrorRequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { sendErrorResponse } from '@/utils/response';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode =
    typeof err?.statusCode === 'number' ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  const message =
    typeof err?.message === 'string' && err.message
      ? err.message
      : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);

  return sendErrorResponse(res, {
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'production' ? {} : { error: err?.stack }),
  });
};

export default errorHandler;
