import { Router } from 'express';
import { defineRoutes } from '@/utils/defineRoutes';
import catchAsync from '@/utils/catchAsync';
import {
  exchangeCodeSchema,
  objectIdParam,
  refreshSessionSchema,
  requestDesktopAuthSchema,
  requestIdParam,
  requestIdQuery,
} from '@repo/database';
import { validateRequest } from '../../middlewares/validateRequest';
import { createRequireAuth } from '../../middlewares/requireAuth';
import { requireDesktopAuth } from '../../middlewares/requireDesktopAuth';
import { loginLimiter } from '@/utils/loginLimiter';
import * as controller from './desktop-auth.controller';
import * as sessionController from './session.controller';
import type { Auth } from '../../../lib/auth';

export function desktopAuthRouter(auth: Auth) {
  const router = Router();
  const requireAuth = createRequireAuth(auth);

  defineRoutes(router, [
    {
      method: 'post',
      path: '/request',
      middlewares: [validateRequest({ body: requestDesktopAuthSchema })],
      handler: catchAsync(controller.request),
    },
    {
      method: 'get',
      path: '/pending',
      middlewares: [requireAuth],
      handler: catchAsync(controller.pending),
    },
    {
      method: 'get',
      path: '/status',
      middlewares: [validateRequest({ query: requestIdQuery })],
      handler: catchAsync(controller.status),
    },
    {
      method: 'post',
      path: '/exchange',
      middlewares: [loginLimiter, validateRequest({ body: exchangeCodeSchema })],
      handler: catchAsync(sessionController.exchange),
    },
    {
      method: 'get',
      path: '/me',
      middlewares: [requireDesktopAuth],
      handler: catchAsync(sessionController.me),
    },
    {
      method: 'post',
      path: '/sessions/refresh',
      middlewares: [loginLimiter, validateRequest({ body: refreshSessionSchema })],
      handler: catchAsync(sessionController.refresh),
    },
    {
      method: 'post',
      path: '/sessions/logout',
      middlewares: [requireDesktopAuth],
      handler: catchAsync(sessionController.logout),
    },
    {
      method: 'get',
      path: '/sessions',
      middlewares: [requireDesktopAuth],
      handler: catchAsync(sessionController.list),
    },
    {
      method: 'delete',
      path: '/sessions/:id',
      middlewares: [requireDesktopAuth, validateRequest({ params: objectIdParam })],
      handler: catchAsync(sessionController.revoke),
    },
    {
      method: 'post',
      path: '/:requestId/approve',
      middlewares: [requireAuth, validateRequest({ params: requestIdParam })],
      handler: catchAsync(controller.approve),
    },
    {
      method: 'post',
      path: '/:requestId/cancel',
      middlewares: [validateRequest({ params: requestIdParam })],
      handler: catchAsync(controller.cancel),
    },
  ]);

  return router;
}
