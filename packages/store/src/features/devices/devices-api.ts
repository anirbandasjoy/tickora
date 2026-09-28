import type {
  DesktopDevice,
  DeviceHeartbeatInput,
  ListQuery,
  RenameDeviceInput,
} from "@repo/database";
import type { BaseApi } from "../../base-api";
import { unwrapList } from "../../response";

export function injectDevicesApi(baseApi: BaseApi) {
  return baseApi.injectEndpoints({
    endpoints: (build) => ({
      listDevices: build.query<DesktopDevice[], ListQuery>({
        query: (params) => ({ url: "v1/devices/", params }),
        transformResponse: (res: { data: DesktopDevice[] | { data?: DesktopDevice[] } }) =>
          unwrapList(res),
        providesTags: ["Device"],
      }),
      heartbeatDevice: build.mutation<{ ok: boolean }, DeviceHeartbeatInput>({
        query: (body) => ({ url: "v1/devices/heartbeat", method: "POST", body }),
        transformResponse: (res: { data: { ok: boolean } }) => res.data,
      }),
      renameDevice: build.mutation<DesktopDevice, { id: string } & RenameDeviceInput>({
        query: ({ id, ...body }) => ({ url: `v1/devices/${id}`, method: "PATCH", body }),
        transformResponse: (res: { data: DesktopDevice }) => res.data,
        invalidatesTags: ["Device"],
      }),
      revokeDevice: build.mutation<{ revoked: boolean }, { id: string }>({
        query: ({ id }) => ({ url: `v1/devices/${id}/revoke`, method: "DELETE" }),
        transformResponse: (res: { data: { revoked: boolean } }) => res.data,
        invalidatesTags: ["Device"],
      }),
    }),
    overrideExisting: false,
  });
}
