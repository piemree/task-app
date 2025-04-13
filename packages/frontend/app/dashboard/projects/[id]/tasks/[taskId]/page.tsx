import { TaskDetail } from "@/components/tasks/task-detail";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Görev Detayı",
	description: "Görev detayları ve günlükler",
};

export default async function TaskDetailPage({
	params,
}: {
	params: Promise<{ id: string; taskId: string }>;
}) {
	const { id, taskId } = await params;
	return <TaskDetail projectId={id} taskId={taskId} />;
}
