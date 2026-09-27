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

  // 500s are otherwise invisible: morgan only logs status + bytes.
  if (statusCode >= 500) {
    console.error(`[${_req.method} ${_req.originalUrl}]`, err instanceof Error ? err.stack : err);
  }

  return sendErrorResponse(res, {
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'production' ? {} : { error: err?.stack }),
  });
};

export default errorHandler;
