import type { ReportQuery, ReportSummary } from "@repo/database";
import type { BaseApi } from "../../base-api";

export function injectReportsApi(baseApi: BaseApi) {
  return baseApi.injectEndpoints({
    endpoints: (build) => ({
      getReportSummary: build.query<ReportSummary, ReportQuery>({
        query: (params) => ({ url: "v1/reports/summary", params }),
        transformResponse: (res: { data: ReportSummary }) => res.data,
        providesTags: ["Report"],
      }),
    }),
    overrideExisting: false,
  });
}
