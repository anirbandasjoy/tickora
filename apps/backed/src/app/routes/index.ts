import { Router } from 'express';
import { desktopAuthRouter } from '../modules/desktop-auth/desktop-auth.router';
import { devicesRouter } from '../modules/devices/devices.router';
import { projectsRouter } from '../modules/projects/projects.router';
import { timerRouter } from '../modules/timer/timer.router';
import { activityRouter } from '../modules/activity/activity.router';
import { settingsRouter } from '../modules/settings/settings.router';
import { apiKeysRouter } from '../modules/api-keys/api-keys.router';
import { publicRouter } from '../modules/api-keys/public.router';
import { reportsRouter } from '../modules/reports/reports.router';
import type { Auth } from '../../lib/auth';

export function apiRouter(auth: Auth) {
  const router = Router();

  const routes = [
    { path: '/desktop/auth', router: desktopAuthRouter(auth) },
    { path: '/devices', router: devicesRouter(auth) },
    { path: '/projects', router: projectsRouter(auth) },
    { path: '/timer', router: timerRouter(auth) },
    { path: '/activity', router: activityRouter(auth) },
    { path: '/settings', router: settingsRouter(auth) },
    { path: '/api-keys', router: apiKeysRouter(auth) },
    { path: '/public', router: publicRouter() },
    { path: '/reports', router: reportsRouter(auth) },
  ];

  routes.forEach((route) => {
    router.use(route.path, route.router);
  });

  return router;
}
