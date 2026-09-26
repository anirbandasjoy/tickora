import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  appendEvent,
  consumeAuthRequest,
  createDesktopSession,
  findAuthRequest,
  randomToken,
  registerDevice,
  sha256Hex,
} from '@repo/database';
import { sendErrorResponse, sendSuccessResponse } from '@/utils/response';
import { withTransaction } from '@/utils/withTransaction';
import { verifyCode } from './desktop-auth.service';

const SESSION_TTL_DAYS = 30;

export const sessionShape = (s: { _id: unknown; deviceId: unknown; expiresAt: Date; lastUsedAt: Date; revokedAt: Date | null }) => ({
  id: String(s._id),
  deviceId: String(s.deviceId),
  expiresAt: s.expiresAt,
  lastUsedAt: s.lastUsedAt,
  revokedAt: s.revokedAt,
});

export async function exchangeCode(req: Request, res: Response) {
  const { requestId, code } = req.body as { requestId: string; code: string };
  const stored = await findAuthRequest(requestId);
  if (!stored || stored.status !== 'AUTHORIZED' || stored.expiresAt.getTime() < Date.now()) {
    return sendErrorResponse(res, { statusCode: StatusCodes.GONE, message: 'Code expired or invalid' });
  }
  if (!verifyCode(stored.codeHash, code)) {
    return sendErrorResponse(res, { statusCode: StatusCodes.UNAUTHORIZED, message: 'Invalid code' });
  }
  const consumed = await consumeAuthRequest(requestId);
  if (!consumed || !consumed.userId) {
    return sendErrorResponse(res, { statusCode: StatusCodes.CONFLICT, message: 'Code already used' });
  }
  const userId = consumed.userId;
  const rawToken = randomToken(32);
  const result = await withTransaction(async (session) => {
    const device = await registerDevice(
      userId,
      {
        deviceIdentifier: consumed.deviceIdentifier,
        name: `${consumed.platform} Desktop`,
        platform: consumed.platform,
        architecture: 'unknown',
        hostname: null,
        osVersion: null,
        appVersion: consumed.appVersion,
      },
      session,
    );
    const doc = await createDesktopSession(
      {
        userId,
        deviceId: String(device._id),
        refreshTokenHash: sha256Hex(rawToken),
        tokenFamilyId: randomToken(16),
        expiresAt: new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000),
        ipAddress: req.ip ?? null,
        userAgent: req.headers['user-agent'] ?? null,
      },
      session,
    );
    await appendEvent({
      userId,
      workSessionId: null,
      deviceId: String(device._id),
      type: 'DEVICE_ONLINE',
    });
    return { doc, device };
  });
  return sendSuccessResponse(res, {
    statusCode: StatusCodes.CREATED,
    data: {
      refreshToken: rawToken,
      tokenType: 'Bearer',
      expiresAt: result.doc.expiresAt,
      device: { id: String(result.device._id), name: result.device.name },
    },
  });
}
