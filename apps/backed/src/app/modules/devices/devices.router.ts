import { Router } from 'express';
import { defineRoutes } from '@/utils/defineRoutes';
import catchAsync from '@/utils/catchAsync';
import { deviceHeartbeatSchema, listQuery, objectIdParam, renameDeviceSchema } from '@repo/database';
import { validateRequest } from '../../middlewares/validateRequest';
import { createResolveUser } from '../../middlewares/resolveUser';
import * as controller from './devices.controller';
import type { Auth } from '../../../lib/auth';

export function devicesRouter(auth: Auth) {
  const router = Router();
  const resolveUser = createResolveUser(auth);

  defineRoutes(router, [
    { method: 'get', path: '/', middlewares: [resolveUser, validateRequest({ query: listQuery })], handler: catchAsync(controller.list) },
    {
      method: 'post',
      path: '/heartbeat',
      middlewares: [resolveUser, validateRequest({ body: deviceHeartbeatSchema })],
      handler: catchAsync(controller.heartbeat),
    },
    {
      method: 'patch',
      path: '/:id',
      middlewares: [resolveUser, validateRequest({ params: objectIdParam, body: renameDeviceSchema })],
      handler: catchAsync(controller.rename),
    },
    {
      method: 'delete',
      path: '/:id/revoke',
      middlewares: [resolveUser, validateRequest({ params: objectIdParam })],
      handler: catchAsync(controller.revoke),
    },
    // Spec §15/§16 alias: POST /api/v1/desktop/devices/:deviceId/revoke
    {
      method: 'post',
      path: '/:id/revoke',
      middlewares: [resolveUser, validateRequest({ params: objectIdParam })],
      handler: catchAsync(controller.revoke),
    },
  ]);

  return router;
}
