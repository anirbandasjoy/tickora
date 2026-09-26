import { Router } from 'express';
import { defineRoutes } from '@/utils/defineRoutes';
import catchAsync from '@/utils/catchAsync';
import {
  createProjectSchema,
  objectIdParam,
  projectListQuery,
  updateProjectSchema,
} from '@repo/database';
import { validateRequest } from '../../middlewares/validateRequest';
import { createResolveUser } from '../../middlewares/resolveUser';
import * as controller from './projects.controller';
import type { Auth } from '../../../lib/auth';

export function projectsRouter(auth: Auth) {
  const router = Router();
  const resolveUser = createResolveUser(auth);

  defineRoutes(router, [
    {
      method: 'post',
      path: '/',
      middlewares: [resolveUser, validateRequest({ body: createProjectSchema })],
      handler: catchAsync(controller.create),
    },
    {
      method: 'get',
      path: '/',
      middlewares: [resolveUser, validateRequest({ query: projectListQuery })],
      handler: catchAsync(controller.list),
    },
    {
      method: 'get',
      path: '/:id',
      middlewares: [resolveUser, validateRequest({ params: objectIdParam })],
      handler: catchAsync(controller.get),
    },
    {
      method: 'patch',
      path: '/:id',
      middlewares: [resolveUser, validateRequest({ params: objectIdParam, body: updateProjectSchema })],
      handler: catchAsync(controller.update),
    },
    {
      method: 'post',
      path: '/:id/archive',
      middlewares: [resolveUser, validateRequest({ params: objectIdParam })],
      handler: catchAsync(controller.archive),
    },
    {
      method: 'post',
      path: '/:id/unarchive',
      middlewares: [resolveUser, validateRequest({ params: objectIdParam })],
      handler: catchAsync(controller.unarchive),
    },
    {
      method: 'delete',
      path: '/:id',
      middlewares: [resolveUser, validateRequest({ params: objectIdParam })],
      handler: catchAsync(controller.remove),
    },
  ]);

  return router;
}
