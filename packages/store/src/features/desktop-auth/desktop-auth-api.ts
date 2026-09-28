import type {
  AuthRequestStatus,
  ExchangeCodeInput,
  RefreshSessionInput,
  RequestDesktopAuthInput,
  SessionUser,
} from "@repo/database";
import type { BaseApi } from "../../base-api";

export interface AuthRequestInfo {
  requestId: string;
  authorizeUrl: string;
  expiresAt: string;
}

export interface AuthRequestState {
  status: AuthRequestStatus;
  expiresAt: string;
  device?: {
    name: string;
    platform: string;
    architecture: string;
    appVersion: string;
  };
}

export interface DeviceApproval {
  requestId: string;
  code: string;
  deepLink: string;
}

export interface DesktopSessionTokens {
  refreshToken: string;
  tokenType: "Bearer";
  expiresAt: string;
}

export interface DesktopSessionInfo {
  id: string;
  deviceId: string;
  expiresAt: string;
  lastUsedAt: string;
  revokedAt: string | null;
}

export function injectDesktopAuthApi(baseApi: BaseApi) {
  return baseApi.injectEndpoints({
    endpoints: (build) => ({
      requestDesktopAuth: build.mutation<AuthRequestInfo, RequestDesktopAuthInput>({
        query: (body) => ({ url: "v1/desktop/auth/request", method: "POST", body }),
        transformResponse: (res: { data: AuthRequestInfo }) => res.data,
      }),
      desktopAuthStatus: build.query<AuthRequestState, { requestId: string }>({
        query: ({ requestId }) => ({ url: "v1/desktop/auth/status", params: { requestId } }),
        transformResponse: (res: { data: AuthRequestState }) => res.data,
        providesTags: ["DesktopAuth"],
      }),
      approveDesktopAuth: build.mutation<DeviceApproval, { requestId: string }>({
        query: ({ requestId }) => ({
          url: `v1/desktop/auth/${requestId}/approve`,
          method: "POST",
        }),
        transformResponse: (res: { data: DeviceApproval }) => res.data,
        invalidatesTags: ["DesktopAuth"],
      }),
      cancelDesktopAuth: build.mutation<
        { cancelled: boolean },
        { requestId: string; deviceIdentifier?: string }
      >({
        query: ({ requestId, deviceIdentifier }) => ({
          url: `v1/desktop/auth/${requestId}/cancel`,
          method: "POST",
          body: deviceIdentifier ? { deviceIdentifier } : {},
        }),
        transformResponse: (res: { data: { cancelled: boolean } }) => res.data,
      }),
      exchangeCode: build.mutation<
        DesktopSessionTokens & { device: { id: string; name: string } },
        ExchangeCodeInput
      >({
        query: (body) => ({ url: "v1/desktop/auth/exchange", method: "POST", body }),
        transformResponse: (res: {
          data: DesktopSessionTokens & { device: { id: string; name: string } };
        }) => res.data,
      }),
      refreshDesktopSession: build.mutation<DesktopSessionTokens, RefreshSessionInput>({
        query: (body) => ({ url: "v1/desktop/auth/sessions/refresh", method: "POST", body }),
        transformResponse: (res: { data: DesktopSessionTokens }) => res.data,
      }),
      logoutDesktopSession: build.mutation<{ loggedOut: boolean }, void>({
        query: () => ({ url: "v1/desktop/auth/sessions/logout", method: "POST" }),
        transformResponse: (res: { data: { loggedOut: boolean } }) => res.data,
        invalidatesTags: ["DesktopAuth", "Session"],
      }),
      listDesktopSessions: build.query<DesktopSessionInfo[], void>({
        query: () => "v1/desktop/auth/sessions",
        transformResponse: (res: { data: DesktopSessionInfo[] }) => res.data,
        providesTags: ["DesktopAuth"],
      }),
      revokeDesktopSession: build.mutation<{ revoked: boolean }, { id: string }>({
        query: ({ id }) => ({ url: `v1/desktop/auth/sessions/${id}`, method: "DELETE" }),
        transformResponse: (res: { data: { revoked: boolean } }) => res.data,
        invalidatesTags: ["DesktopAuth"],
      }),
      desktopMe: build.query<{ user: SessionUser }, void>({
        query: () => "v1/desktop/auth/me",
        transformResponse: (res: { data: { user: SessionUser } }) => res.data,
        providesTags: ["DesktopAuth"],
      }),
    }),
    overrideExisting: false,
  });
}
