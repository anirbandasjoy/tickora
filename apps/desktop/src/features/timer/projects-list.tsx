import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { Spinner } from "@repo/ui/components/core/spinner";
import { Input } from "@repo/ui/components/core/input";
import type { TimerProject } from "./use-timer";

/** Home page: all trackable projects. Tap one to open its track page. */
export function ProjectsList({
  projects,
  loading,
  loadError,
  runningProjectId,
  notice,
  onOpen,
  onRetry,
}: {
  projects: TimerProject[];
  loading: boolean;
  loadError: boolean;
  runningProjectId: string | null;
  notice: string | null;
  onOpen: (project: TimerProject) => void;
  onRetry: () => void;
}) {
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const visible = q
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q),
      )
    : projects;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground">Projects</p>
      {notice && <p className="text-center text-xs text-destructive">{notice}</p>}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pl-8 text-xs"
        />
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner className="size-5" />
        </div>
      ) : loadError ? (
        <button
          type="button"
          onClick={onRetry}
          className="py-4 text-center text-xs text-destructive underline-offset-4 hover:underline"
        >
          Could not load projects — retry
        </button>
      ) : projects.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">
          No trackable projects — create one on the Tickora website.
        </p>
      ) : visible.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">
          No projects match “{search.trim()}”.
        </p>
      ) : (
        visible.map((p) => {
          const running = runningProjectId === p._id;
          return (
            <button
              key={p._id}
              type="button"
              onClick={() => onOpen(p)}
              className="flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-left transition hover:bg-muted/50"
            >
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: p.color ?? "#94a3b8" }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{p.name}</span>
                {running && (
                  <span className="flex items-center gap-1 text-[11px] text-green-600">
                    <span className="size-1.5 animate-pulse rounded-full bg-green-500" />
                    Tracking
                  </span>
                )}
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          );
        })
      )}
    </div>
  );
}
