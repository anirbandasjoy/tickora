import type { ClientSession } from 'mongoose';
import {
  DesktopSessionModel,
  type DesktopSessionDocument,
} from '../../models/desktop/desktop-session.model';

export async function createDesktopSession(
  data: {
    userId: string;
    deviceId: string;
    refreshTokenHash: string;
    tokenFamilyId: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  },
  session?: ClientSession,
): Promise<DesktopSessionDocument> {
  const doc = new DesktopSessionModel({
    ...data,
    lastUsedAt: new Date(),
    ipAddress: data.ipAddress ?? null,
    userAgent: data.userAgent ?? null,
  });
  await doc.save({ session });
  return doc;
}

export async function findValidSessionByHash(
  refreshTokenHash: string,
): Promise<DesktopSessionDocument | null> {
  return DesktopSessionModel.findOne({
    refreshTokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
}

export async function findSessionByHash(
  refreshTokenHash: string,
): Promise<DesktopSessionDocument | null> {
  return DesktopSessionModel.findOne({ refreshTokenHash });
}

export async function findActiveFamilyMember(
  tokenFamilyId: string,
): Promise<DesktopSessionDocument | null> {
  return DesktopSessionModel.findOne({
    tokenFamilyId,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
}

export async function rotateSessionToken(
  id: string,
  oldHash: string,
  next: { refreshTokenHash: string; expiresAt: Date },
  session?: ClientSession,
): Promise<DesktopSessionDocument | null> {
  const rotated = await DesktopSessionModel.findOneAndUpdate(
    { _id: id, refreshTokenHash: oldHash, revokedAt: null },
    { revokedAt: new Date(), revocationReason: 'ROTATED' },
    { new: true, session },
  );
  if (!rotated) return null;
  const doc = new DesktopSessionModel({
    userId: rotated.userId,
    deviceId: rotated.deviceId,
    refreshTokenHash: next.refreshTokenHash,
    tokenFamilyId: rotated.tokenFamilyId,
    expiresAt: next.expiresAt,
    lastUsedAt: new Date(),
    ipAddress: rotated.ipAddress,
    userAgent: rotated.userAgent,
  });
  await doc.save({ session });
  return doc;
}

export async function listUserSessions(userId: string): Promise<DesktopSessionDocument[]> {
  return DesktopSessionModel.find({ userId }).sort({ createdAt: -1 });
}
