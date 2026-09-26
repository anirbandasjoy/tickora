import { Router } from 'express';
import { defineRoutes } from '@/utils/defineRoutes';
import catchAsync from '@/utils/catchAsync';
import {
  objectIdParam,
  startTimerSchema,
  stopTimerSchema,
  syncSessionsSchema,
  workSessionListQuery,
} from '@repo/database';
import { validateRequest } from '../../middlewares/validateRequest';
import { createResolveUser } from '../../middlewares/resolveUser';
import * as controller from './timer.controller';
import type { Auth } from '../../../lib/auth';

export function timerRouter(auth: Auth) {
  const router = Router();
  const resolveUser = createResolveUser(auth);

  defineRoutes(router, [
    {
      method: 'post',
      path: '/start',
      middlewares: [resolveUser, validateRequest({ body: startTimerSchema })],
      handler: catchAsync(controller.start),
    },
    {
      method: 'post',
      path: '/stop',
      middlewares: [resolveUser, validateRequest({ body: stopTimerSchema })],
      handler: catchAsync(controller.stop),
    },
    {
      method: 'post',
      path: '/:id/heartbeat',
      middlewares: [resolveUser, validateRequest({ params: objectIdParam })],
      handler: catchAsync(controller.heartbeat),
    },
    {
      method: 'post',
      path: '/sync',
      middlewares: [resolveUser, validateRequest({ body: syncSessionsSchema })],
      handler: catchAsync(controller.sync),
    },
    {
      method: 'get',
      path: '/active',
      middlewares: [resolveUser],
      handler: catchAsync(controller.active),
    },
    {
      method: 'get',
      path: '/',
      middlewares: [resolveUser, validateRequest({ query: workSessionListQuery })],
      handler: catchAsync(controller.list),
    },
  ]);

  return router;
}
