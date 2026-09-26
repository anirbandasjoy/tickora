import type { ClientSession, FilterQuery } from 'mongoose';
import { DesktopDeviceModel, type DesktopDeviceDocument } from '../../models/desktop/desktop-device.model';
import type { RegisterDeviceInput } from '../../schemas/desktop/desktop-device.schema';

export async function registerDevice(
  userId: string,
  input: RegisterDeviceInput,
  session?: ClientSession,
): Promise<DesktopDeviceDocument> {
  const { deviceIdentifier, name, ...rest } = input;
  const doc = await DesktopDeviceModel.findOneAndUpdate(
    { userId, deviceIdentifier },
    {
      $set: { ...rest, userId, isActive: true, revokedAt: null, lastSeenAt: new Date() },
      $setOnInsert: { deviceIdentifier, name },
    },
    { new: true, upsert: true, session },
  );
  if (!doc) throw new Error('Failed to register device');
  return doc;
}

export async function listDevices(userId: string): Promise<DesktopDeviceDocument[]> {
  return DesktopDeviceModel.find({ userId }).sort({ createdAt: -1 });
}

export async function getDevice(id: string, userId: string): Promise<DesktopDeviceDocument | null> {
  return DesktopDeviceModel.findOne({ _id: id, userId });
}

export async function revokeDevice(
  id: string,
  userId: string,
  session?: ClientSession,
): Promise<DesktopDeviceDocument | null> {
  return DesktopDeviceModel.findOneAndUpdate(
    { _id: id, userId } as FilterQuery<DesktopDeviceDocument>,
    { isActive: false, revokedAt: new Date() },
    { new: true, session },
  );
}

export async function touchDevice(
  id: string,
  userId: string,
  appVersion?: string,
): Promise<void> {
  await DesktopDeviceModel.updateOne(
    { _id: id, userId } as FilterQuery<DesktopDeviceDocument>,
    { lastSeenAt: new Date(), ...(appVersion ? { appVersion } : {}) },
  );
}
