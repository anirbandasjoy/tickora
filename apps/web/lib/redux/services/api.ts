import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Session } from "@/lib/auth-client";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api", credentials: "include" }),
  tagTypes: ["Session"],
  endpoints: () => ({}),
});

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<Session, void>({
      query: () => "me",
      transformResponse: (res: { data: Session }) => res.data,
      providesTags: ["Session"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMeQuery } = authApi;
