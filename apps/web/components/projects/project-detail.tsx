"use client";

import { InviteMemberDialog } from "@/components/projects/invite-member-dialog";
import { ProjectMembers } from "@/components/projects/project-members";
import { NewTaskDialog } from "@/components/tasks/new-task-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectService } from "@/services/project-service";
import { taskService } from "@/services/task-service";
import type { ProjectResponse } from "@schemas/project.schema";
import type { TaskResponse } from "@schemas/task.schema";
import { CalendarDays, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function ProjectDetail({ projectId }: { projectId: string }) {
	const router = useRouter();
	const [project, setProject] = useState<ProjectResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [tasks, setTasks] = useState<TaskResponse[]>([]);

	const fetchProject = useCallback(async () => {
		setIsLoading(true);
		try {
			const project = await projectService.getProject(projectId);
			setProject(project);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Bir hata oluştu");
		} finally {
			setIsLoading(false);
		}
	}, [projectId]);

	const fetchTasks = useCallback(async () => {
		const tasks = await taskService.getTasks(projectId);
		setTasks(tasks);
	}, [projectId]);

	useEffect(() => {
		fetchProject();
		fetchTasks();
	}, [fetchProject, fetchTasks]);

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-1/3" />
					<Skeleton className="h-10 w-24" />
				</div>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-1/4" />
						<Skeleton className="h-4 w-full mt-2" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-2/3 mt-2" />
					</CardContent>
				</Card>
				<Tabs defaultValue="tasks">
					<TabsList>
						<TabsTrigger value="tasks">Görevler</TabsTrigger>
						<TabsTrigger value="members">Üyeler</TabsTrigger>
					</TabsList>
					<TabsContent value="tasks" className="mt-4">
						<div className="grid gap-4">
							{[1, 2, 3].map((i) => (
								<Card key={i}>
									<CardHeader className="p-4">
										<Skeleton className="h-5 w-1/3" />
									</CardHeader>
									<CardContent className="p-4 pt-0">
										<Skeleton className="h-4 w-full" />
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		);
	}

	if (!project) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<h2 className="text-xl font-semibold">Proje bulunamadı</h2>
				<p className="text-muted-foreground mt-2">İstediğiniz proje bulunamadı veya erişim izniniz yok.</p>
				<Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard")}>
					Dashboard'a Dön
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
				<div className="flex gap-2">
					<NewTaskDialog projectId={project._id} onSuccess={fetchTasks} />
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Proje Detayları</CardTitle>
					<CardDescription>{project.description || "Bu proje için açıklama bulunmuyor."}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-2">
						<div className="flex items-center text-sm">
							<Users className="mr-2 h-4 w-4 text-muted-foreground" />
							<span>
								{project.owner.firstName} {project.owner.lastName} tarafından oluşturuldu
							</span>
						</div>
						<div className="flex items-center text-sm">
							<CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
							<span>{new Date(project.createdAt).toLocaleDateString("tr-TR")}</span>
						</div>
						<div className="flex items-center gap-2 mt-2">
							<Badge variant="outline">{project.members.length} üye</Badge>
							<Badge variant="outline">
								{project.members.find((m) => m.user._id === project.owner._id)?.role || "owner"}
							</Badge>
						</div>
					</div>
				</CardContent>
			</Card>

			<Tabs defaultValue="tasks">
				<TabsList>
					<TabsTrigger value="tasks">Görevler</TabsTrigger>
					<TabsTrigger value="members">Üyeler</TabsTrigger>
				</TabsList>
				<TabsContent value="tasks" className="mt-4">
					<TaskList projectId={project._id} tasks={tasks} isLoading={isLoading} />
				</TabsContent>
				<TabsContent value="members" className="mt-4">
					<ProjectMembers projectId={project._id} members={project.members} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
