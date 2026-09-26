import { Router } from 'express';
import { defineRoutes } from '@/utils/defineRoutes';
import catchAsync from '@/utils/catchAsync';
import { activityListQuery } from '@repo/database';
import { validateRequest } from '../../middlewares/validateRequest';
import { createResolveUser } from '../../middlewares/resolveUser';
import * as controller from './activity.controller';
import type { Auth } from '../../../lib/auth';

export function activityRouter(auth: Auth) {
  const router = Router();
  const resolveUser = createResolveUser(auth);

  defineRoutes(router, [
    {
      method: 'get',
      path: '/',
      middlewares: [resolveUser, validateRequest({ query: activityListQuery })],
      handler: catchAsync(controller.list),
    },
  ]);

  return router;
}
