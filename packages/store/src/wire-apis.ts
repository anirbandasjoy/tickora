import type { BaseApi } from "./base-api";
import { injectSessionApi } from "./features/auth/session-api";
import { injectTimerApi } from "./features/timer/timer-api";
import { injectProjectsApi } from "./features/projects/projects-api";
import { injectDevicesApi } from "./features/devices/devices-api";
import { injectSettingsApi } from "./features/settings/settings-api";
import { injectActivityApi } from "./features/activity/activity-api";
import { injectReportsApi } from "./features/reports/reports-api";
import { injectApiKeysApi } from "./features/api-keys/api-keys-api";
import { injectDesktopAuthApi } from "./features/desktop-auth/desktop-auth-api";

export function wireApis(baseApi: BaseApi) {
  return {
    baseApi,
    sessionApi: injectSessionApi(baseApi),
    timerApi: injectTimerApi(baseApi),
    projectsApi: injectProjectsApi(baseApi),
    devicesApi: injectDevicesApi(baseApi),
    settingsApi: injectSettingsApi(baseApi),
    activityApi: injectActivityApi(baseApi),
    reportsApi: injectReportsApi(baseApi),
    apiKeysApi: injectApiKeysApi(baseApi),
    desktopAuthApi: injectDesktopAuthApi(baseApi),
  };
}

export type WiredApis = ReturnType<typeof wireApis>;
