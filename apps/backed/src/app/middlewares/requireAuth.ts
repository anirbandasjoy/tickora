import { NextFunction, Request, Response } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { sendErrorResponse } from '@/utils/response';
import type { Auth } from '../../lib/auth';

export function createRequireAuth(auth: Auth) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return sendErrorResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: getReasonPhrase(StatusCodes.UNAUTHORIZED),
      });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
    req.session = { id: session.session.id };
    return next();
  };
}
