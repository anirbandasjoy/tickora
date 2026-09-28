import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { toNodeHandler } from 'better-auth/node';
import type { Auth } from './lib/auth';
import { createRequireAuth } from './app/middlewares/requireAuth';
import errorHandler from './app/middlewares/errorHandler';
import notFoundHandler from './app/middlewares/notFoundHandler';
import { sendSuccessResponse } from './utils/response';
import { config } from './config/env';
import { apiRouter } from './app/routes';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

export function createApp(auth: Auth) {
  const app = express();

  // Trust the platform reverse proxy so protocol detection and client IPs
  // work correctly in production.
  app.set('trust proxy', 1);

  // Auth/device polling endpoints must never be cacheable: Express ETags
  // make browsers/WebKit send conditional GETs → 304 empty bodies, which
  // break RTK Query's `res => res.data` transform on both web and desktop.
  app.set('etag', false);
  app.use('/api', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    next();
  });

  app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Better Auth handler must be mounted BEFORE body parsers, otherwise
  // the client hangs on pending requests (official Express guide).
  app.use('/api/auth', authLimiter);
  app.all('/api/auth/*splat', toNodeHandler(auth));

  app.use(
    cors({
      origin: [...config.CORS_ORIGINS],
      credentials: true,
    })
  );

  app.use(express.json());

  app.get('/health', (_req, res) => {
    return sendSuccessResponse(res, { data: { status: 'ok' } });
  });

  const requireAuth = createRequireAuth(auth);

  app.get('/api/me', requireAuth, (req, res) => {
    return sendSuccessResponse(res, { data: { user: req.user, session: req.session } });
  });

  app.use('/api/v1', apiRouter(auth));

  // Catch-all route for handling 404 Not Found
  app.use(notFoundHandler);

  // Error Handling Middleware
  app.use(errorHandler);

  return app;
}
