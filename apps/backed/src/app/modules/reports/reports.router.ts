import { Router } from 'express';
import { defineRoutes } from '@/utils/defineRoutes';
import catchAsync from '@/utils/catchAsync';
import { reportQuerySchema } from '@repo/database';
import { validateRequest } from '../../middlewares/validateRequest';
import { createResolveUser } from '../../middlewares/resolveUser';
import * as controller from './reports.controller';
import type { Auth } from '../../../lib/auth';

export function reportsRouter(auth: Auth) {
  const router = Router();
  const resolveUser = createResolveUser(auth);

  defineRoutes(router, [
    {
      method: 'get',
      path: '/summary',
      middlewares: [resolveUser, validateRequest({ query: reportQuerySchema })],
      handler: catchAsync(controller.summary),
    },
  ]);

  return router;
}
