import { Request, Response } from 'express';
import type { ActivityListQuery } from '@repo/database';
import { sendSuccessResponse } from '@/utils/response';
import { userIdOf } from '@/utils/user-id';
import * as service from './activity.service';

export async function list(req: Request, res: Response) {
  const data = await service.listUserEvents(userIdOf(req), req.query as unknown as ActivityListQuery);
  return sendSuccessResponse(res, { data });
}
