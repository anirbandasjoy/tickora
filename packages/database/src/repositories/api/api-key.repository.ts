import {
  ApiKeyModel,
  type ApiKeyDocument,
} from "../../models/api/api-key.model";

export async function createApiKeyRecord(data: {
  userId: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  scopes: string[];
  expiresAt: Date | null;
}): Promise<ApiKeyDocument> {
  return ApiKeyModel.create({ ...data, lastUsedAt: null, revokedAt: null });
}

export async function findApiKeyByHash(
  keyHash: string,
): Promise<ApiKeyDocument | null> {
  return ApiKeyModel.findOne({ keyHash, revokedAt: null });
}

export async function listApiKeys(userId: string): Promise<ApiKeyDocument[]> {
  return ApiKeyModel.find({ userId })
    .sort({ createdAt: -1 })
    .select("-keyHash");
}

export async function revokeApiKey(id: string, userId: string): Promise<void> {
  await ApiKeyModel.updateOne({ _id: id, userId }, { revokedAt: new Date() });
}

export async function touchApiKeyLastUsed(id: string): Promise<void> {
  await ApiKeyModel.updateOne({ _id: id }, { lastUsedAt: new Date() });
}
