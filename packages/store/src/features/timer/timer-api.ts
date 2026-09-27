import type {
  StartTimerInput,
  StopTimerInput,
  SyncSessionsInput,
  WorkSession,
  WorkSessionListQuery,
  WorkSessionStatus,
} from "@repo/database";
import type { BaseApi } from "../../base-api";

export interface SyncResult {
  synced: number;
  skipped: number;
}

export function injectTimerApi(baseApi: BaseApi) {
  return baseApi.injectEndpoints({
    endpoints: (build) => ({
      startTimer: build.mutation<WorkSession, StartTimerInput>({
        query: (body) => ({ url: "v1/timer/start", method: "POST", body }),
        transformResponse: (res: { data: WorkSession }) => res.data,
        invalidatesTags: ["Timer"],
      }),
      stopTimer: build.mutation<WorkSession, StopTimerInput>({
        query: (body) => ({ url: "v1/timer/stop", method: "POST", body }),
        transformResponse: (res: { data: WorkSession }) => res.data,
        invalidatesTags: ["Timer"],
      }),
      heartbeatTimer: build.mutation<{ ok: boolean }, { id: string }>({
        query: ({ id }) => ({ url: `v1/timer/${id}/heartbeat`, method: "POST" }),
        transformResponse: (res: { data: { ok: boolean } }) => res.data,
      }),
      syncSessions: build.mutation<SyncResult, SyncSessionsInput>({
        query: (body) => ({ url: "v1/timer/sync", method: "POST", body }),
        transformResponse: (res: { data: SyncResult }) => res.data,
        invalidatesTags: ["Timer"],
      }),
      activeTimer: build.query<WorkSession | null, void>({
        query: () => "v1/timer/active",
        transformResponse: (res: { data: WorkSession | null }) => res.data,
        providesTags: ["Timer"],
      }),
      listTimers: build.query<WorkSession[], WorkSessionListQuery & { status?: WorkSessionStatus }>({
        query: (params) => ({ url: "v1/timer/", params }),
        transformResponse: (res: { data: WorkSession[] }) => res.data,
        providesTags: ["Timer"],
      }),
    }),
    overrideExisting: false,
  });
}
