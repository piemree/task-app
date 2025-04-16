import { TaskDetail } from "@/components/tasks/task-detail";
import { taskService } from "@/services/task-service";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Görev Detayı",
	description: "Görev detayları ve günlükler",
};

const fetchInitialData = async (projectId: string, taskId: string) => {
	try {
		const [task, taskLogs] = await Promise.all([
			taskService.getTask(projectId, taskId),
			taskService.getTaskLogs(projectId, taskId),
		]);
		return { task, taskLogs };
	} catch (error) {
		console.error(error);
		return { task: null, taskLogs: [] };
	}
};

export default async function TaskDetailPage({
	params,
}: {
	params: Promise<{ id: string; taskId: string }>;
}) {
	const { id, taskId } = await params;
	const { task, taskLogs } = await fetchInitialData(id, taskId);
	return <TaskDetail projectId={id} taskId={taskId} initialTask={task} initialTaskLogs={taskLogs} />;
}
