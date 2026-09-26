import {
  appendEvent,
  getDevice,
  listDevices,
  revokeDevice as revokeDeviceRecord,
  revokeSessionsByDevice,
  touchDevice,
  type DesktopDeviceDocument,
} from '@repo/database';
import { withTransaction } from '@/utils/withTransaction';

export async function listUserDevices(userId: string): Promise<DesktopDeviceDocument[]> {
  return listDevices(userId);
}

export async function heartbeatDevice(
  userId: string,
  deviceId: string,
  appVersion?: string,
): Promise<void> {
  await touchDevice(deviceId, userId, appVersion);
}

export async function renameUserDevice(
  userId: string,
  id: string,
  name: string,
): Promise<DesktopDeviceDocument | null> {
  const device = await getDevice(id, userId);
  if (!device) return null;
  device.name = name;
  await device.save();
  return device;
}

export async function revokeUserDevice(userId: string, id: string): Promise<boolean> {
  const device = await getDevice(id, userId);
  if (!device) return false;
  await withTransaction(async (session) => {
    await revokeDeviceRecord(String(device._id), userId, session);
    await revokeSessionsByDevice(String(device._id), userId, 'DEVICE_REVOKED', session);
    await appendEvent(
      { userId, workSessionId: null, deviceId: String(device._id), type: 'DEVICE_OFFLINE' },
      session,
    );
  });
  return true;
}
