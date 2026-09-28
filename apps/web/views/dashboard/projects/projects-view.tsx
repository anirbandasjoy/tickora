"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Archive, ArchiveRestore, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@repo/ui/components/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/core/card";
import { Badge } from "@repo/ui/components/core/badge";
import { Spinner } from "@repo/ui/components/core/spinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/core/dialog";
import { Input } from "@repo/ui/components/core/input";
import { RHFTextField } from "@repo/ui/components/form/rhf/rhf-text-field";
import { RHFTextareaField } from "@repo/ui/components/form/rhf/rhf-textarea-field";
import { RHFCheckboxField } from "@repo/ui/components/form/rhf/rhf-checkbox-field";
import type { Project } from "@repo/database";
import { hooks } from "@/lib/store";
import { ConfirmModal } from "@/components/common/confirm-modal";

type ProjectItem = Project & { _id: string; createdAt: string; updatedAt: string };

const COLOR_PRESETS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7"];

const projectFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  color: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{6})$/, "Invalid hex color")
    .nullable()
    .optional(),
  timerEnabled: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

function ProjectDialog({
  open,
  onOpenChange,
  project,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectItem | null;
}) {
  const [createProject, { isLoading: creating }] = hooks.useCreateProjectMutation();
  const [updateProject, { isLoading: updating }] = hooks.useUpdateProjectMutation();
  const { control, handleSubmit, reset, formState } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      color: project?.color ?? COLOR_PRESETS[0],
      timerEnabled: project?.timerEnabled ?? true,
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    const body = {
      name: values.name.trim(),
      description: values.description?.trim() ? values.description.trim() : null,
      color: values.color ?? null,
      timerEnabled: values.timerEnabled,
    };
    try {
      if (project) {
        await updateProject({ id: project._id, ...body }).unwrap();
        toast.success("Project updated.");
      } else {
        await createProject(body).unwrap();
        toast.success("Project created.");
      }
      reset();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.data?.message ?? "Could not save the project.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit project" : "New project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <RHFTextField control={control} name="name" label="Name" placeholder="Upfounder" />
          <RHFTextareaField
            control={control}
            name="description"
            label="Description"
            placeholder="What is this project about?"
          />
          <div className="space-y-2">
            <span className="text-sm font-medium">Color</span>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Use color ${c}`}
                      onClick={() => field.onChange(c)}
                      className="size-7 rounded-full border-2 transition"
                      style={{
                        backgroundColor: c,
                        borderColor: field.value === c ? "#000" : "transparent",
                      }}
                    />
                  ))}
                  <Input
                    type="color"
                    value={field.value ?? COLOR_PRESETS[0]}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="size-7 cursor-pointer p-0"
                  />
                </div>
              )}
            />
          </div>
          <RHFCheckboxField
            control={control}
            name="timerEnabled"
            label="Timer enabled (desktop can track time on this project)"
          />
          <DialogFooter>
            <Button
              type="button"
              appearance="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={creating || updating || formState.isSubmitting}>
              {project ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectsView() {
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [deleting, setDeleting] = useState<ProjectItem | null>(null);

  const { data: projects = [], isLoading, isError, refetch } = hooks.useListProjectsQuery({
    page: 1,
    archived: showArchived ? "true" : "false",
    search: search.trim() || undefined,
    limit: 50,
  });
  const [archiveProject] = hooks.useArchiveProjectMutation();
  const [unarchiveProject] = hooks.useUnarchiveProjectMutation();
  const [deleteProject, { isLoading: deletePending }] = hooks.useDeleteProjectMutation();

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (project: ProjectItem) => {
    setEditing(project);
    setDialogOpen(true);
  };

  const handleArchiveToggle = async (project: ProjectItem) => {
    try {
      if (project.isArchived) {
        await unarchiveProject({ id: project._id }).unwrap();
        toast.success("Project unarchived.");
      } else {
        await archiveProject({ id: project._id }).unwrap();
        toast.success("Project archived.");
      }
    } catch (e: any) {
      toast.error(e?.data?.message ?? "Could not change archive state.");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteProject({ id: deleting._id }).unwrap();
      toast.success("Project deleted.");
      setDeleting(null);
    } catch (e: any) {
      toast.error(
        e?.data?.message ?? "Could not delete the project. Archive it instead.",
      );
    }
  };

  return (
    <main className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Create projects here — the desktop timer tracks time against them.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> New project
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button
          appearance={showArchived ? "solid" : "outline"}
          variant="default"
          onClick={() => setShowArchived((v) => !v)}
        >
          {showArchived ? "Showing archived" : "Show archived"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="size-6" />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <p className="text-sm text-destructive">Could not load projects.</p>
            <Button appearance="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {showArchived ? "No archived projects." : "No projects yet. Create your first one."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(projects as ProjectItem[]).map((project) => (
            <Card key={project._id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: project.color ?? "#94a3b8" }}
                  />
                  <span className="truncate">{project.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {project.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
                <div className="flex gap-2">
                  {!project.timerEnabled && <Badge variant="warning">Timer off</Badge>}
                  {project.isArchived && <Badge variant="secondary">Archived</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button
                    appearance="outline"
                    className="flex-1"
                    onClick={() => openEdit(project)}
                  >
                    <Pencil className="size-4" /> Edit
                  </Button>
                  <Button
                    appearance="outline"
                    className="flex-1"
                    onClick={() => void handleArchiveToggle(project)}
                  >
                    {project.isArchived ? (
                      <>
                        <ArchiveRestore className="size-4" /> Unarchive
                      </>
                    ) : (
                      <>
                        <Archive className="size-4" /> Archive
                      </>
                    )}
                  </Button>
                  <Button
                    appearance="outline"
                    onClick={() => setDeleting(project)}
                    aria-label={`Delete ${project.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProjectDialog
        key={editing?._id ?? "new"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editing}
      />

      <ConfirmModal
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={`Delete “${deleting?.name ?? ""}”?`}
        description="Projects with tracked time cannot be deleted — archive them instead."
        confirmLabel="Delete"
        pending={deletePending}
        onConfirm={() => void handleDelete()}
      />
    </main>
  );
}
