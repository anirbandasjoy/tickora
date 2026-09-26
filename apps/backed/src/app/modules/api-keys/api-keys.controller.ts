import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendErrorResponse, sendSuccessResponse } from '@/utils/response';
import { userIdOf } from '@/utils/user-id';
import * as service from './api-keys.service';

export async function create(req: Request, res: Response) {
  const data = await service.createUserKey(userIdOf(req), req.body);
  return sendSuccessResponse(res, { statusCode: StatusCodes.CREATED, data });
}

export async function list(req: Request, res: Response) {
  const data = await service.listUserKeys(userIdOf(req));
  return sendSuccessResponse(res, { data });
}

export async function revoke(req: Request, res: Response) {
  await service.revokeUserKey(userIdOf(req), String(req.params.id));
  return sendSuccessResponse(res, { data: { revoked: true } });
}

export async function status(req: Request, res: Response) {
  const rawKey = typeof req.headers['x-api-key'] === 'string' ? req.headers['x-api-key'] : '';
  const identity = await service.authenticateApiKey(rawKey, 'status:read');
  if (!identity) {
    return sendErrorResponse(res, { statusCode: StatusCodes.UNAUTHORIZED, message: 'Invalid API key' });
  }
  const data = await service.currentStatus(identity.userId);
  return sendSuccessResponse(res, { data });
}
