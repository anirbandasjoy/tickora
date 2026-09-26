import { Model, Query, PopulateOptions, Document } from 'mongoose';

export type Keys<T> = T extends object ? Extract<keyof T, string> : never;

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedResponse<Lean = Record<string, unknown>> {
  meta: Meta;
  data: Lean[];
}

export type QueryOf<Doc extends Document = Document> = Query<Doc[], Doc>;
export type ModelOf<Doc extends Document = Document> = Model<Doc>;
export type PopulateInput = string | PopulateOptions | (string | PopulateOptions)[];
