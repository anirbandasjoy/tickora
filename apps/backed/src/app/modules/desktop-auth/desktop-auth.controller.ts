import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendErrorResponse, sendSuccessResponse } from '@/utils/response';
import { userIdOf } from '@/utils/user-id';
import * as service from './desktop-auth.service';

export async function request(req: Request, res: Response) {
  const data = await service.createRequest(req.body);
  return sendSuccessResponse(res, { statusCode: StatusCodes.CREATED, data });
}

export async function pending(req: Request, res: Response) {
  const rows = await service.listPending(userIdOf(req));
  return sendSuccessResponse(res, { data: rows });
}

export async function approve(req: Request, res: Response) {
  // Supports both spec alias (body { requestId }) and legacy (params :requestId).
  const requestId = String(req.params.requestId ?? (req.body as any)?.requestId ?? '');
  const data = await service.approveRequest(userIdOf(req), requestId);
  if (!data) {
    return sendErrorResponse(res, {
      statusCode: StatusCodes.GONE,
      message: 'Request expired or already handled',
    });
  }
  return sendSuccessResponse(res, { data });
}

export async function status(req: Request, res: Response) {
  const data = await service.getRequestStatus(String(req.query.requestId));
  if (!data) {
    return sendErrorResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Request not found',
    });
  }
  return sendSuccessResponse(res, { data });
}

export async function cancel(req: Request, res: Response) {
  const requestId = String(req.params.requestId ?? (req.body as any)?.requestId ?? '');
  const deviceIdentifier =
    typeof (req.body as any)?.deviceIdentifier === 'string'
      ? ((req.body as any).deviceIdentifier as string)
      : undefined;
  // Web cancel (authenticated) binds via userId; desktop cancel binds via deviceIdentifier.
  const userId = (req as any)?.user?.id as string | undefined;
  const data = await service.cancelRequest(requestId, { userId, deviceIdentifier });
  return sendSuccessResponse(res, { data });
}
