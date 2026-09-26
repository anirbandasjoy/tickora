import { Router } from 'express';
import { defineRoutes } from '@/utils/defineRoutes';
import catchAsync from '@/utils/catchAsync';
import { status } from './api-keys.controller';

export function publicRouter() {
  const router = Router();

  defineRoutes(router, [
    { method: 'get', path: '/status', middlewares: [], handler: catchAsync(status) },
  ]);

  return router;
}
