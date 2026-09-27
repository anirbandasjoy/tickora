import type { UpdateUserSettingInput, UserSetting } from "@repo/database";
import type { BaseApi } from "../../base-api";

export function injectSettingsApi(baseApi: BaseApi) {
  return baseApi.injectEndpoints({
    endpoints: (build) => ({
      getSettings: build.query<UserSetting, void>({
        query: () => "v1/settings/me",
        transformResponse: (res: { data: UserSetting }) => res.data,
        providesTags: ["Setting"],
      }),
      updateSettings: build.mutation<UserSetting, UpdateUserSettingInput>({
        query: (body) => ({ url: "v1/settings/me", method: "PUT", body }),
        transformResponse: (res: { data: UserSetting }) => res.data,
        invalidatesTags: ["Setting"],
      }),
    }),
    overrideExisting: false,
  });
}
