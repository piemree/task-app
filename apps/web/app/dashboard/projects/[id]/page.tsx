import { ProjectDetail } from "@/components/projects/project-detail";
import { projectService } from "@/services/project-service";
import { taskService } from "@/services/task-service";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Project Details",
	description: "Project details and tasks",
};

const fetchInitialData = async (projectId: string) => {
	try {
		const [project, tasks] = await Promise.all([projectService.getProject(projectId), taskService.getTasks(projectId)]);
		return { project, tasks };
	} catch (error) {
		console.error(error);
		return { project: null, tasks: [] };
	}
};

export default async function ProjectDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const { project, tasks } = await fetchInitialData(id);
	return <ProjectDetail projectId={id} initialProject={project} initialTasks={tasks} />;
}
