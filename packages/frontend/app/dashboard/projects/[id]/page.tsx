import type { Metadata } from "next"
import { ProjectDetail } from "@/components/projects/project-detail"

export const metadata: Metadata = {
  title: "Proje Detayı",
  description: "Proje detayları ve görevler",
}

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return <ProjectDetail projectId={params.id} />
}
