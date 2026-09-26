import { NextFunction, Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { sendErrorResponse } from '@/utils/response';
import { authenticateDesktop } from './authenticate';

export async function requireDesktopAuth(req: Request, res: Response, next: NextFunction) {
  const identity = await authenticateDesktop(req).catch(() => null);
  if (!identity) {
    return sendErrorResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: getReasonPhrase(StatusCodes.UNAUTHORIZED),
    });
  }
  req.desktop = identity;
  return next();
}
