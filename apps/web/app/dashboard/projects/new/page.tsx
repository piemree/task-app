import { NewProjectForm } from "@/components/projects/new-project-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "New Project",
	description: "Create a new project",
};

export default function NewProjectPage() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">New Project</h2>
			</div>
			<NewProjectForm />
		</div>
	);
}
