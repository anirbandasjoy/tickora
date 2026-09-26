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
    platform: input.platform,
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
): Promise<void> {
  await DesktopAuthRequestModel.updateOne(
    { requestId, status: "PENDING", ...(userId ? { userId } : {}) },
    { status: "CANCELLED" },
  );
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
