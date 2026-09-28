import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError, type ZodType } from 'zod';
import { sendErrorResponse } from '@/utils/response';

interface ValidateSources {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export function validateRequest(sources: ValidateSources) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (sources.body) req.body = sources.body.parse(req.body ?? {});
      if (sources.query) {
        const parsed = sources.query.parse(req.query);
        Object.assign(req.query, parsed);
      }
      if (sources.params) req.params = sources.params.parse(req.params);
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return sendErrorResponse(res, {
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Validation failed',
          error: err.flatten().fieldErrors,
        });
      }
      return next(err);
    }
  };
}
