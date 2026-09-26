import { z } from 'zod';
import { isoDateString } from '../shared.schema';

export const apiKeyScopeSchema = z.enum(['status:read', 'profile:read']);

export type ApiKeyScope = z.infer<typeof apiKeyScopeSchema>;

export const apiKeySchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1).max(100),
  keyPrefix: z.string().min(1).max(32),
  keyHash: z.string().length(64),
  scopes: z.array(apiKeyScopeSchema).min(1),
  lastUsedAt: z.date().nullable(),
  expiresAt: z.date().nullable(),
  revokedAt: z.date().nullable(),
});

export type ApiKey = z.infer<typeof apiKeySchema>;

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(apiKeyScopeSchema).min(1),
  expiresAt: isoDateString.nullable().optional(),
});

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
