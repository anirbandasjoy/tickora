import { Request, Response, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { sendErrorResponse } from '@/utils/response';

const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  return sendErrorResponse(res, {
    statusCode: StatusCodes.NOT_FOUND,
    message: getReasonPhrase(StatusCodes.NOT_FOUND),
    error: `Route ${req.originalUrl} not found`,
  });
};

export default notFoundHandler;
