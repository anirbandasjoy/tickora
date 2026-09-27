import type { ApiKey, CreateApiKeyInput } from "@repo/database";
import type { BaseApi } from "../../base-api";

export type ApiKeyListItem = Omit<ApiKey, "keyHash">;

export interface CreatedApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  apiKey: string;
}

export interface PublicStatus {
  working: boolean;
  project: { id: string; name: string } | null;
  device: { id: string; name: string } | null;
  startedAt: string | null;
  elapsedSeconds: number;
}

export function injectApiKeysApi(baseApi: BaseApi) {
  return baseApi.injectEndpoints({
    endpoints: (build) => ({
      createApiKey: build.mutation<CreatedApiKey, CreateApiKeyInput>({
        query: (body) => ({ url: "v1/api-keys/", method: "POST", body }),
        transformResponse: (res: { data: CreatedApiKey }) => res.data,
        invalidatesTags: ["ApiKey"],
      }),
      listApiKeys: build.query<ApiKeyListItem[], void>({
        query: () => "v1/api-keys/",
        transformResponse: (res: { data: ApiKeyListItem[] }) => res.data,
        providesTags: ["ApiKey"],
      }),
      revokeApiKey: build.mutation<{ revoked: boolean }, { id: string }>({
        query: ({ id }) => ({ url: `v1/api-keys/${id}`, method: "DELETE" }),
        transformResponse: (res: { data: { revoked: boolean } }) => res.data,
        invalidatesTags: ["ApiKey"],
      }),
      publicStatus: build.query<PublicStatus, string>({
        query: (apiKey) => ({
          url: "v1/public/status",
          headers: { "x-api-key": apiKey },
        }),
        transformResponse: (res: { data: PublicStatus }) => res.data,
      }),
    }),
    overrideExisting: false,
  });
}
