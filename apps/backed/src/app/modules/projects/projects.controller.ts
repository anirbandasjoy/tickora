import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ProjectModel, qb } from '@repo/database';
import { sendErrorResponse, sendSuccessResponse } from '@/utils/response';
import { userIdOf } from '@/utils/user-id';
import * as service from './projects.service';

export async function create(req: Request, res: Response) {
  const doc = await service.createUserProject(userIdOf(req), req.body);
  return sendSuccessResponse(res, { statusCode: StatusCodes.CREATED, data: doc });
}

export async function list(req: Request, res: Response) {
  const q = req.query as {
    archived?: string;
    search?: string;
    sortBy?: string;
    fields?: string;
    page?: unknown;
    limit?: unknown;
  };
  const result = await qb(ProjectModel)
    .filter({
      userId: userIdOf(req),
      ...(q.archived !== undefined ? { isArchived: q.archived === 'true' } : {}),
    })
    .search(q.search, ['name', 'description'])
    .sort(q.sortBy ?? '-createdAt')
    .select(q.fields)
    .paginate(q.page, q.limit)
    .exec();
  return sendSuccessResponse(res, { data: result });
}

export async function get(req: Request, res: Response) {
  const doc = await service.getUserProject(userIdOf(req), String(req.params.id));
  if (!doc) {
    return sendErrorResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Project not found',
    });
  }
  return sendSuccessResponse(res, { data: doc });
}

export async function update(req: Request, res: Response) {
  const doc = await service.updateUserProject(userIdOf(req), String(req.params.id), req.body);
  if (!doc) {
    return sendErrorResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Project not found',
    });
  }
  return sendSuccessResponse(res, { data: doc });
}

async function setArchived(req: Request, res: Response, archived: boolean) {
  const doc = await service.setArchived(userIdOf(req), String(req.params.id), archived);
  if (!doc) {
    return sendErrorResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Project not found',
    });
  }
  return sendSuccessResponse(res, { data: doc });
}

export async function archive(req: Request, res: Response) {
  return setArchived(req, res, true);
}

export async function unarchive(req: Request, res: Response) {
  return setArchived(req, res, false);
}

export async function remove(req: Request, res: Response) {
  const outcome = await service.deleteUserProject(userIdOf(req), String(req.params.id));
  if (outcome === 'not-found') {
    return sendErrorResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Project not found',
    });
  }
  if (outcome === 'has-history') {
    return sendErrorResponse(res, {
      statusCode: StatusCodes.CONFLICT,
      message: 'Project has work history; archive it instead',
    });
  }
  return sendSuccessResponse(res, { data: { deleted: true } });
}
