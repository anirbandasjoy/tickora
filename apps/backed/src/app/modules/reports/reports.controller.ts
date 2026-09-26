import { Request, Response } from 'express';
import type { ReportQuery } from '@repo/database';
import { sendSuccessResponse } from '@/utils/response';
import { userIdOf } from '@/utils/user-id';
import * as service from './reports.service';

export async function summary(req: Request, res: Response) {
  const data = await service.summarize(userIdOf(req), req.query as unknown as ReportQuery);
  return sendSuccessResponse(res, { data });
}
