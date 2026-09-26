import {
  approveAuthRequest,
  cancelAuthRequest,
  createAuthRequest,
  findAuthRequest,
  listPendingForUser,
  randomToken,
  sha256Hex,
  timingSafeEqualHex,
  type RequestDesktopAuthInput,
} from '@repo/database';
import { config } from '@/config/env';

export async function createRequest(input: RequestDesktopAuthInput) {
  const requestId = randomToken(24);
  const doc = await createAuthRequest(input, requestId);
  return {
    requestId: doc.requestId,
    authorizeUrl: `${config.CLIENT_URI}/desktop/authorize?requestId=${doc.requestId}`,
    expiresAt: doc.expiresAt,
  };
}

export async function listPending(userId: string) {
  return listPendingForUser(userId);
}

export async function approveRequest(userId: string, requestId: string) {
  const code = randomToken(32);
  const doc = await approveAuthRequest(requestId, userId, sha256Hex(code));
  if (!doc) return null;
  return {
    requestId: doc.requestId,
    code,
    deepLink: `tickora://auth?code=${code}&requestId=${doc.requestId}`,
  };
}

export async function getRequestStatus(requestId: string) {
  const doc = await findAuthRequest(requestId);
  if (!doc) return null;
  const expired = doc.expiresAt.getTime() < Date.now();
  return { status: expired ? 'EXPIRED' : doc.status, expiresAt: doc.expiresAt };
}

export async function cancelRequest(requestId: string) {
  await cancelAuthRequest(requestId);
  return { cancelled: true };
}

export function verifyCode(storedHash: string | null, code: string): boolean {
  if (!storedHash) return false;
  return timingSafeEqualHex(storedHash, sha256Hex(code));
}
