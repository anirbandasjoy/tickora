import type { Metadata } from "next";
import { ProjectsView } from "@/views/dashboard/projects/projects-view";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return <ProjectsView />;
}
