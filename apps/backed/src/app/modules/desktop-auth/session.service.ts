import {
  appendEvent,
  consumeAuthRequest,
  createDesktopSession,
  findAuthRequest,
  randomToken,
  registerDevice,
  sha256Hex,
  updateAuthRequestDevice,
} from '@repo/database';
import { withTransaction } from '@/utils/withTransaction';
import { verifyCode } from './desktop-auth.service';

const SESSION_TTL_DAYS = 30;

type ExchangeResult =
  | { ok: true; refreshToken: string; expiresAt: Date; device: { id: string; name: string } }
  | { ok: false; code: number; message: string };

export async function exchangeCode(
  input: { requestId: string; code?: string },
  ctx: { ip: string | null; userAgent: string | null }
): Promise<ExchangeResult> {
  const { requestId, code } = input;

  const stored = await findAuthRequest(requestId);
  if (!stored || stored.status !== 'AUTHORIZED' || stored.expiresAt.getTime() < Date.now()) {
    return { ok: false, code: 410, message: 'Code expired or invalid' };
  }
  // Deep-link path: verify the one-time code. Polling path (no code):
  // AUTHORIZED status + 192-bit requestId secrecy + atomic consume below.
  if (code !== undefined && !verifyCode(stored.codeHash, code)) {
    return { ok: false, code: 401, message: 'Invalid code' };
  }
  const consumed = await consumeAuthRequest(requestId);
  if (!consumed || !consumed.userId) {
    return { ok: false, code: 409, message: 'Code already used' };
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
      session
    );
    
    // Update the auth request with the deviceId
    await updateAuthRequestDevice(requestId, String(device._id), session);
    
    const doc = await createDesktopSession(
      {
        userId,
        deviceId: String(device._id),
        refreshTokenHash: sha256Hex(rawToken),
        tokenFamilyId: randomToken(16),
        expiresAt: new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000),
        ipAddress: ctx.ip,
        userAgent: ctx.userAgent,
      },
      session
    );
    await appendEvent(
      { userId, workSessionId: null, deviceId: String(device._id), type: 'DEVICE_ONLINE' },
      session
    );
    return { doc, device };
  });
  return {
    ok: true,
    refreshToken: rawToken,
    expiresAt: result.doc.expiresAt,
    device: { id: String(result.device._id), name: result.device.name },
  };
}
