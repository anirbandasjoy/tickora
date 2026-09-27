import type { SessionUser } from "@repo/database";
import type { BaseApi } from "../../base-api";

export function injectSessionApi(baseApi: BaseApi) {
  return baseApi.injectEndpoints({
    endpoints: (build) => ({
      getMe: build.query<{ user: SessionUser }, void>({
        query: () => "me",
        transformResponse: (res: { data: { user: SessionUser } }) => res.data,
        providesTags: ["Session"],
      }),
    }),
    overrideExisting: false,
  });
}
