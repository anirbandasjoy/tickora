import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DesktopDeviceModel, qb } from '@repo/database';
import { sendErrorResponse, sendSuccessResponse } from '@/utils/response';
import { userIdOf } from '@/utils/user-id';
import * as service from './devices.service';

export async function list(req: Request, res: Response) {
  const q = req.query as { search?: string; sortBy?: string; fields?: string; page?: unknown; limit?: unknown };
  const result = await qb(DesktopDeviceModel)
    .filter({ userId: userIdOf(req) })
    .search(q.search, ['name', 'hostname'])
    .sort(q.sortBy ?? '-createdAt')
    .select(q.fields)
    .paginate(q.page, q.limit)
    .exec();
  return sendSuccessResponse(res, { data: result });
}

export async function heartbeat(req: Request, res: Response) {
  const deviceId = req.desktop?.deviceId;
  if (!deviceId) {
    return sendErrorResponse(res, { statusCode: StatusCodes.BAD_REQUEST, message: 'Desktop session required' });
  }
  const appVersion = typeof req.body.appVersion === 'string' ? req.body.appVersion : undefined;
  await service.heartbeatDevice(userIdOf(req), deviceId, appVersion);
  return sendSuccessResponse(res, { data: { ok: true } });
}

export async function rename(req: Request, res: Response) {
  const doc = await service.renameUserDevice(userIdOf(req), String(req.params.id), req.body.name as string);
  if (!doc) {
    return sendErrorResponse(res, { statusCode: StatusCodes.NOT_FOUND, message: 'Device not found' });
  }
  return sendSuccessResponse(res, { data: doc });
}

export async function revoke(req: Request, res: Response) {
  const ok = await service.revokeUserDevice(userIdOf(req), String(req.params.id));
  if (!ok) {
    return sendErrorResponse(res, { statusCode: StatusCodes.NOT_FOUND, message: 'Device not found' });
  }
  return sendSuccessResponse(res, { data: { revoked: true } });
}
