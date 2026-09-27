import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface BaseApiConfig {
  baseUrl: string;
  getToken?: () => string | null | undefined;
}

export const apiTags = [
  "Session",
  "Timer",
  "Project",
  "Device",
  "Setting",
  "Activity",
  "Report",
  "ApiKey",
  "DesktopAuth",
] as const;

export function createBaseApi({ baseUrl, getToken }: BaseApiConfig) {
  return createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
      baseUrl,
      credentials: "include",
      prepareHeaders: (headers) => {
        const token = getToken?.();
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
      },
    }),
    tagTypes: [...apiTags],
    endpoints: () => ({}),
  });
}

export type BaseApi = ReturnType<typeof createBaseApi>;
