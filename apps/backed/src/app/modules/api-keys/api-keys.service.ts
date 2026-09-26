import {
  createApiKeyRecord,
  findApiKeyByHash,
  generateApiKey,
  getDevice,
  getProject,
  listApiKeys,
  findRunningSession,
  revokeApiKey,
  sha256Hex,
  timingSafeEqualHex,
  touchApiKeyLastUsed,
  type ApiKeyScope,
  type CreateApiKeyInput,
} from '@repo/database';

export async function createUserKey(userId: string, input: CreateApiKeyInput) {
  const { raw, prefix, hash } = generateApiKey();
  const doc = await createApiKeyRecord({
    userId,
    name: input.name,
    keyPrefix: prefix,
    keyHash: hash,
    scopes: input.scopes,
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
  });
  return { id: String(doc._id), name: doc.name, keyPrefix: prefix, apiKey: raw };
}

export async function listUserKeys(userId: string) {
  return listApiKeys(userId);
}

export async function revokeUserKey(userId: string, id: string) {
  await revokeApiKey(id, userId);
}

export interface ApiKeyIdentity {
  userId: string;
  keyId: string;
  scopes: string[];
}

export async function authenticateApiKey(
  rawKey: string,
  requiredScope: ApiKeyScope,
): Promise<ApiKeyIdentity | null> {
  if (!rawKey.startsWith('tk_live_')) return null;
  const hash = sha256Hex(rawKey);
  const record = await findApiKeyByHash(hash);
  if (!record || !timingSafeEqualHex(record.keyHash, hash)) return null;
  if (record.revokedAt) return null;
  if (record.expiresAt && record.expiresAt.getTime() < Date.now()) return null;
  if (!record.scopes.includes(requiredScope)) return null;
  await touchApiKeyLastUsed(String(record._id));
  return { userId: record.userId, keyId: String(record._id), scopes: record.scopes };
}

export async function currentStatus(userId: string) {
  const running = await findRunningSession(userId);
  if (!running) return { working: false as const };
  const project = await getProject(String(running.projectId), userId);
  const device = await getDevice(String(running.deviceId), userId);
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - running.startedAt.getTime()) / 1000));
  return {
    working: true as const,
    project: project ? { id: String(project._id), name: project.name } : null,
    device: device ? { id: String(device._id), name: device.name } : null,
    startedAt: running.startedAt,
    elapsedSeconds,
  };
}
