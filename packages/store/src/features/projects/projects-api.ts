import type {
  CreateProjectInput,
  Project,
  ProjectListQuery,
  UpdateProjectInput,
} from "@repo/database";
import type { BaseApi } from "../../base-api";
import { unwrapList } from "../../response";

export function injectProjectsApi(baseApi: BaseApi) {
  return baseApi.injectEndpoints({
    endpoints: (build) => ({
      createProject: build.mutation<Project, CreateProjectInput>({
        query: (body) => ({ url: "v1/projects/", method: "POST", body }),
        transformResponse: (res: { data: Project }) => res.data,
        invalidatesTags: ["Project"],
      }),
      listProjects: build.query<Project[], ProjectListQuery>({
        query: (params) => ({ url: "v1/projects/", params }),
        transformResponse: (res: { data: Project[] | { data?: Project[] } }) =>
          unwrapList(res),
        providesTags: ["Project"],
      }),
      getProject: build.query<Project, { id: string }>({
        query: ({ id }) => `v1/projects/${id}`,
        transformResponse: (res: { data: Project }) => res.data,
        providesTags: ["Project"],
      }),
      updateProject: build.mutation<Project, { id: string } & UpdateProjectInput>({
        query: ({ id, ...body }) => ({ url: `v1/projects/${id}`, method: "PATCH", body }),
        transformResponse: (res: { data: Project }) => res.data,
        invalidatesTags: ["Project"],
      }),
      archiveProject: build.mutation<Project, { id: string }>({
        query: ({ id }) => ({ url: `v1/projects/${id}/archive`, method: "POST" }),
        transformResponse: (res: { data: Project }) => res.data,
        invalidatesTags: ["Project"],
      }),
      unarchiveProject: build.mutation<Project, { id: string }>({
        query: ({ id }) => ({ url: `v1/projects/${id}/unarchive`, method: "POST" }),
        transformResponse: (res: { data: Project }) => res.data,
        invalidatesTags: ["Project"],
      }),
      deleteProject: build.mutation<{ deleted: boolean }, { id: string }>({
        query: ({ id }) => ({ url: `v1/projects/${id}`, method: "DELETE" }),
        transformResponse: (res: { data: { deleted: boolean } }) => res.data,
        invalidatesTags: ["Project"],
      }),
    }),
    overrideExisting: false,
  });
}
