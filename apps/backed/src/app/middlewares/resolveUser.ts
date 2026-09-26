import { NextFunction, Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { sendErrorResponse } from '@/utils/response';
import { authenticateCookie, authenticateDesktop } from './authenticate';
import type { Auth } from '../../lib/auth';

export function createResolveUser(auth: Auth) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const desktop = await authenticateDesktop(req).catch(() => null);
    if (desktop) {
      req.desktop = desktop;
      return next();
    }

    const cookie = await authenticateCookie(auth, req).catch(() => null);
    if (!cookie) {
      return sendErrorResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: getReasonPhrase(StatusCodes.UNAUTHORIZED),
      });
    }
    req.user = cookie.user;
    req.session = { id: cookie.sessionId };
    return next();
  };
}
