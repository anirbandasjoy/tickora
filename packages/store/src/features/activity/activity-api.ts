import type { ActivityEvent, ActivityListQuery } from "@repo/database";
import type { BaseApi } from "../../base-api";

export function injectActivityApi(baseApi: BaseApi) {
  return baseApi.injectEndpoints({
    endpoints: (build) => ({
      listActivity: build.query<ActivityEvent[], ActivityListQuery>({
        query: (params) => ({ url: "v1/activity/", params }),
        transformResponse: (res: { data: ActivityEvent[] }) => res.data,
        providesTags: ["Activity"],
      }),
    }),
    overrideExisting: false,
  });
}
