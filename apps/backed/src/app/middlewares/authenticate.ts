import type { Request } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { sha256Hex, findValidSessionByHash, getDevice } from '@repo/database';
import type { Auth } from '../../lib/auth';

export interface DesktopIdentity {
  userId: string;
  deviceId: string;
  sessionId: string;
}

export interface CookieIdentity {
  id: string;
  email: string;
  name: string;
}

export async function authenticateDesktop(req: Request): Promise<DesktopIdentity | null> {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  if (!token) return null;

  const session = await findValidSessionByHash(sha256Hex(token));
  if (!session) return null;

  const device = await getDevice(String(session.deviceId), session.userId);
  if (!device || !device.isActive || device.revokedAt) return null;

  return {
    userId: session.userId,
    deviceId: String(session.deviceId),
    sessionId: String(session._id),
  };
}

export async function authenticateCookie(
  auth: Auth,
  req: Request,
): Promise<{ user: CookieIdentity; sessionId: string } | null> {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) return null;
  return {
    user: { id: session.user.id, email: session.user.email, name: session.user.name },
    sessionId: session.session.id,
  };
}
