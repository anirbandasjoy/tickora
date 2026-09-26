import type { ClientSession } from 'mongoose';
import { DesktopSessionModel } from '../../models/desktop/desktop-session.model';

export async function revokeSession(
  id: string,
  userId: string,
  reason: string,
  session?: ClientSession,
): Promise<void> {
  await DesktopSessionModel.updateOne(
    { _id: id, userId },
    { revokedAt: new Date(), revocationReason: reason },
    { session },
  );
}

export async function revokeSessionsByDevice(
  deviceId: string,
  userId: string,
  reason: string,
  session?: ClientSession,
): Promise<void> {
  await DesktopSessionModel.updateMany(
    { deviceId, userId, revokedAt: null },
    { revokedAt: new Date(), revocationReason: reason },
    { session },
  );
}

export async function revokeTokenFamily(tokenFamilyId: string, session?: ClientSession): Promise<void> {
  await DesktopSessionModel.updateMany(
    { tokenFamilyId, revokedAt: null },
    { revokedAt: new Date(), revocationReason: 'TOKEN_REUSE_DETECTED' },
    { session },
  );
}
