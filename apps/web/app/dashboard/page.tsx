import { ProjectList } from "@/components/projects/project-list";
import { projectService } from "@/services/project-service";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Project management dashboard",
};

const fetchInitialData = async () => {
	try {
		const projects = await projectService.getProjects();
		return projects;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export default async function DashboardPage() {
	const projects = await fetchInitialData();
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">My Projects</h2>
			</div>
			<ProjectList projects={projects} />
		</div>
	);
}
