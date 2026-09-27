import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendErrorResponse, sendSuccessResponse } from '@/utils/response';
import { userIdOf } from '@/utils/user-id';
import * as service from './session.service';
import * as manageService from './session-manage.service';

export async function exchange(req: Request, res: Response) {
  const result = await service.exchangeCode(req.body, {
    ip: req.ip ?? null,
    userAgent: req.headers['user-agent'] ?? null,
  });
  if (!result.ok) {
    return sendErrorResponse(res, { statusCode: result.code, message: result.message });
  }
  return sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    data: {
      refreshToken: result.refreshToken,
      tokenType: 'Bearer',
      expiresAt: result.expiresAt,
      device: result.device,
    },
  });
}

export async function refresh(req: Request, res: Response) {
  const result = await manageService.refreshUserSession(req.body.refreshToken as string);
  if (!result.ok) {
    return sendErrorResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: result.message,
    });
  }
  return sendSuccessResponse(res, {
    data: { refreshToken: result.refreshToken, tokenType: 'Bearer', expiresAt: result.expiresAt },
  });
}

export async function logout(req: Request, res: Response) {
  const { userId, sessionId, deviceId } = req.desktop!;
  await manageService.logoutUserSession(userId, sessionId, deviceId);
  return sendSuccessResponse(res, { data: { loggedOut: true } });
}

export async function list(req: Request, res: Response) {
  const rows = await manageService.listUserSessionSummaries(userIdOf(req));
  return sendSuccessResponse(res, { data: rows });
}

export async function revoke(req: Request, res: Response) {
  await manageService.revokeUserSession(userIdOf(req), String(req.params.id));
  return sendSuccessResponse(res, { data: { revoked: true } });
}

export async function me(req: Request, res: Response) {
  const profile = await manageService.getDesktopProfile(req.desktop!.userId);
  if (!profile) {
    return sendErrorResponse(res, { statusCode: StatusCodes.NOT_FOUND, message: 'User not found' });
  }
  return sendSuccessResponse(res, { data: { user: profile } });
}
