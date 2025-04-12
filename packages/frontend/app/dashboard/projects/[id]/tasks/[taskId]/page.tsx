import type { Metadata } from "next"
import { TaskDetail } from "@/components/tasks/task-detail"

export const metadata: Metadata = {
  title: "Görev Detayı",
  description: "Görev detayları ve günlükler",
}

export default function TaskDetailPage({
  params,
}: {
  params: { id: string; taskId: string }
}) {
  return <TaskDetail projectId={params.id} taskId={params.taskId} />
}
