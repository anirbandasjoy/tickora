import { Router } from 'express';
import { defineRoutes } from '@/utils/defineRoutes';
import catchAsync from '@/utils/catchAsync';
import { createApiKeySchema, objectIdParam } from '@repo/database';
import { validateRequest } from '../../middlewares/validateRequest';
import { createResolveUser } from '../../middlewares/resolveUser';
import * as controller from './api-keys.controller';
import type { Auth } from '../../../lib/auth';

export function apiKeysRouter(auth: Auth) {
  const router = Router();
  const resolveUser = createResolveUser(auth);

  defineRoutes(router, [
    {
      method: 'post',
      path: '/',
      middlewares: [resolveUser, validateRequest({ body: createApiKeySchema })],
      handler: catchAsync(controller.create),
    },
    {
      method: 'get',
      path: '/',
      middlewares: [resolveUser],
      handler: catchAsync(controller.list),
    },
    {
      method: 'delete',
      path: '/:id',
      middlewares: [resolveUser, validateRequest({ params: objectIdParam })],
      handler: catchAsync(controller.revoke),
    },
  ]);

  return router;
}
