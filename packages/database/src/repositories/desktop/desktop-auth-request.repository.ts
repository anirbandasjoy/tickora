import type { ClientSession } from "mongoose";
import {
  DesktopAuthRequestModel,
  type DesktopAuthRequestDocument,
} from "../../models/desktop/desktop-auth-request.model";
import type { RequestDesktopAuthInput } from "../../schemas/desktop/desktop-auth-request.schema";

const REQUEST_TTL_MS = 10 * 60 * 1000;

export async function createAuthRequest(
  input: RequestDesktopAuthInput,
  requestId: string,
  session?: ClientSession,
): Promise<DesktopAuthRequestDocument> {
  const doc = new DesktopAuthRequestModel({
    requestId,
    deviceIdentifier: input.deviceIdentifier,
    deviceName: input.deviceName ?? null,
    platform: input.platform,
    architecture: input.architecture ?? null,
    hostname: input.hostname ?? null,
    osVersion: input.osVersion ?? null,
    appVersion: input.appVersion,
    status: "PENDING",
    expiresAt: new Date(Date.now() + REQUEST_TTL_MS),
  });
  await doc.save({ session });
  return doc;
}

export async function findAuthRequest(
  requestId: string,
): Promise<DesktopAuthRequestDocument | null> {
  return DesktopAuthRequestModel.findOne({ requestId });
}

export async function approveAuthRequest(
  requestId: string,
  userId: string,
  codeHash: string,
  session?: ClientSession,
): Promise<DesktopAuthRequestDocument | null> {
  return DesktopAuthRequestModel.findOneAndUpdate(
    { requestId, status: "PENDING", expiresAt: { $gt: new Date() } },
    { status: "AUTHORIZED", userId, codeHash, authorizedAt: new Date() },
    { new: true, session },
  );
}

export async function consumeAuthRequest(
  requestId: string,
  session?: ClientSession,
): Promise<DesktopAuthRequestDocument | null> {
  return DesktopAuthRequestModel.findOneAndUpdate(
    { requestId, status: "AUTHORIZED", expiresAt: { $gt: new Date() } },
    { status: "CONSUMED", consumedAt: new Date() },
    { new: true, session },
  );
}

export async function cancelAuthRequest(
  requestId: string,
  userId?: string,
  deviceIdentifier?: string,
): Promise<void> {
  // Ownership: PENDING requests have userId=null, so the desktop proves
  // ownership via its deviceIdentifier. Web cancel proves via userId
  // once AUTHORIZED. Require at least one binding when supplied.
  const filter: Record<string, unknown> = { requestId, status: "PENDING" };
  if (userId) filter.userId = userId;
  if (deviceIdentifier) filter.deviceIdentifier = deviceIdentifier;
  await DesktopAuthRequestModel.updateOne(filter, { status: "CANCELLED" });
}

export async function listPendingForUser(
  userId: string,
): Promise<DesktopAuthRequestDocument[]> {
  return DesktopAuthRequestModel.find({
    userId,
    status: "PENDING",
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });
}

export async function updateAuthRequestDevice(
  requestId: string,
  deviceId: string,
  session?: ClientSession,
): Promise<DesktopAuthRequestDocument | null> {
  return DesktopAuthRequestModel.findOneAndUpdate(
    { requestId },
    { deviceId },
    { new: true, session },
  );
}
