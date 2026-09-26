import {
  appendEvent,
  findActiveFamilyMember,
  findSessionByHash,
  getDevice,
  listUserSessions,
  randomToken,
  revokeSession,
  revokeTokenFamily,
  rotateSessionToken,
  sha256Hex,
} from '@repo/database';

const SESSION_TTL_DAYS = 30;

export const sessionShape = (s: {
  _id: unknown;
  deviceId: unknown;
  expiresAt: Date;
  lastUsedAt: Date;
  revokedAt: Date | null;
}) => ({
  id: String(s._id),
  deviceId: String(s.deviceId),
  expiresAt: s.expiresAt,
  lastUsedAt: s.lastUsedAt,
  revokedAt: s.revokedAt,
});

export async function logoutUserSession(userId: string, sessionId: string, deviceId: string) {
  await revokeSession(sessionId, userId, 'USER_LOGOUT');
  await appendEvent({ userId, workSessionId: null, deviceId, type: 'DEVICE_OFFLINE' });
}

export async function listUserSessionSummaries(userId: string) {
  const rows = await listUserSessions(userId);
  return rows.map(sessionShape);
}

export async function revokeUserSession(userId: string, id: string) {
  await revokeSession(id, userId, 'USER_REVOKED');
}

type RefreshResult =
  | { ok: true; refreshToken: string; expiresAt: Date }
  | { ok: false; message: string };

export async function refreshUserSession(refreshToken: string): Promise<RefreshResult> {
  const presented = await findSessionByHash(sha256Hex(refreshToken));

  if (!presented) return { ok: false, message: 'Invalid token' };
  if (presented.revokedAt) {
    if (presented.revocationReason === 'ROTATED') {
      const fresh = await findActiveFamilyMember(presented.tokenFamilyId);
      if (fresh) {
        await revokeTokenFamily(presented.tokenFamilyId);
        return { ok: false, message: 'Token reused' };
      }
    }
    return { ok: false, message: 'Session revoked' };
  }
  if (presented.expiresAt.getTime() < Date.now()) {
    return { ok: false, message: 'Session expired' };
  }
  const device = await getDevice(String(presented.deviceId), presented.userId);
  if (!device || !device.isActive || device.revokedAt) {
    return { ok: false, message: 'Device revoked' };
  }

  const rawToken = randomToken(32);
  const rotated = await rotateSessionToken(String(presented._id), sha256Hex(refreshToken), {
    refreshTokenHash: sha256Hex(rawToken),
    expiresAt: new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000),
  });
  if (!rotated) {
    await revokeTokenFamily(presented.tokenFamilyId);
    return { ok: false, message: 'Token reused' };
  }
  return { ok: true, refreshToken: rawToken, expiresAt: rotated.expiresAt };
}
