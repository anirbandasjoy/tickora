import { Schema, model, type HydratedDocument } from 'mongoose';
import type { ApiKey } from '../../schemas/api/api-key.schema';

const apiKeyMongooseSchema = new Schema<ApiKey>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true, maxlength: 100 },
    keyPrefix: { type: String, required: true },
    keyHash: { type: String, required: true },
    scopes: { type: [String], required: true },
    lastUsedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

apiKeyMongooseSchema.index({ userId: 1, createdAt: -1 });
apiKeyMongooseSchema.index({ keyHash: 1 });

export type ApiKeyDocument = HydratedDocument<ApiKey>;

export const ApiKeyModel = model<ApiKey>('ApiKey', apiKeyMongooseSchema);
