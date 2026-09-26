import { Request, Response } from 'express';
import { sendSuccessResponse } from '@/utils/response';
import { userIdOf } from '@/utils/user-id';
import * as service from './settings.service';

export async function getMine(req: Request, res: Response) {
  const data = await service.getMine(userIdOf(req));
  return sendSuccessResponse(res, { data });
}

export async function updateMine(req: Request, res: Response) {
  const data = await service.updateMine(userIdOf(req), req.body);
  return sendSuccessResponse(res, { data });
}
