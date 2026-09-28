/**
 * Backend list endpoints return a paginated envelope inside the standard
 * `{ status, message, data }` wrapper, i.e. `{ data: { meta, data: [...] } }`.
 * Older transforms assumed a flat `{ data: [...] }` shape and silently
 * produced a non-array. This helper accepts both shapes defensively.
 */
export function unwrapList<T>(res: { data: T[] | { meta?: unknown; data?: T[] } | null | undefined }): T[] {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (data && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: T[] }).data;
  }
  return [];
}
