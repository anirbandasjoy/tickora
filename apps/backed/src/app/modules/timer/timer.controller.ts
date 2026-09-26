import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { WorkSessionListQuery } from '@repo/database';
import { sendSuccessResponse } from '@/utils/response';
import { userIdOf } from '@/utils/user-id';
import * as service from './timer.service';
import * as syncService from './timer-sync.service';
import * as queryService from './timer-query.service';

export async function start(req: Request, res: Response) {
  const doc = await service.startTimer(userIdOf(req), req.body);
  return sendSuccessResponse(res, { statusCode: StatusCodes.CREATED, data: doc });
}

export async function stop(req: Request, res: Response) {
  const doc = await service.stopTimer(userIdOf(req), req.body);
  return sendSuccessResponse(res, { data: doc });
}

export async function heartbeat(req: Request, res: Response) {
  await syncService.heartbeatTimer(userIdOf(req), String(req.params.id));
  return sendSuccessResponse(res, { data: { ok: true } });
}

export async function sync(req: Request, res: Response) {
  const result = await syncService.syncUserSessions(userIdOf(req), req.body.sessions);
  return sendSuccessResponse(res, { data: result });
}

export async function active(req: Request, res: Response) {
  const running = await syncService.getActiveSession(userIdOf(req));
  if (!running) return sendSuccessResponse(res, { data: null });
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - running.startedAt.getTime()) / 1000));
  return sendSuccessResponse(res, { data: { ...running.toObject(), elapsedSeconds } });
}

export async function list(req: Request, res: Response) {
  const result = await queryService.listUserSessions(userIdOf(req), req.query as unknown as WorkSessionListQuery);
  return sendSuccessResponse(res, { data: result });
}
