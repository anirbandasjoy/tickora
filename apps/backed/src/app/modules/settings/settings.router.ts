import { Router } from 'express';
import { defineRoutes } from '@/utils/defineRoutes';
import catchAsync from '@/utils/catchAsync';
import { updateUserSettingSchema } from '@repo/database';
import { validateRequest } from '../../middlewares/validateRequest';
import { createResolveUser } from '../../middlewares/resolveUser';
import * as controller from './settings.controller';
import type { Auth } from '../../../lib/auth';

export function settingsRouter(auth: Auth) {
  const router = Router();
  const resolveUser = createResolveUser(auth);

  defineRoutes(router, [
    {
      method: 'get',
      path: '/me',
      middlewares: [resolveUser],
      handler: catchAsync(controller.getMine),
    },
    {
      method: 'put',
      path: '/me',
      middlewares: [resolveUser, validateRequest({ body: updateUserSettingSchema })],
      handler: catchAsync(controller.updateMine),
    },
  ]);

  return router;
}
