import { ProjectDetail } from "@/components/projects/project-detail";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Proje Detayı",
	description: "Proje detayları ve görevler",
};

export default async function ProjectDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <ProjectDetail projectId={id} />;
}
