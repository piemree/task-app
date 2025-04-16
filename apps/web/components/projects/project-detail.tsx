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
import { formatDate } from "@/lib/utils";
import { taskService } from "@/services/task-service";
import type { ProjectResponse } from "@schemas/project.schema";
import type { TaskResponse } from "@schemas/task.schema";
import { CalendarDays, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface ProjectDetailProps {
	projectId: string;
	initialProject?: ProjectResponse | null;
	initialTasks?: TaskResponse[];
}

export function ProjectDetail({ projectId, initialProject, initialTasks }: ProjectDetailProps) {
	const [project, setProject] = useState<ProjectResponse | null>(initialProject || null);
	const [isLoading, setIsLoading] = useState(false);
	const [tasks, setTasks] = useState<TaskResponse[]>(initialTasks || []);
	const router = useRouter();

	const fetchTasks = useCallback(async () => {
		setIsLoading(true);
		try {
			const tasks = await taskService.getTasks(projectId);
			setTasks(tasks);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, [projectId]);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	const onRemoveMember = (userId: string) => {
		setProject((prevProject) => {
			if (!prevProject) return null;
			return {
				...prevProject,
				members: prevProject.members.filter((member) => member.user._id !== userId),
			};
		});
	};

	if (isLoading && !tasks.length) {
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
						<TabsTrigger value="tasks">Tasks</TabsTrigger>
						<TabsTrigger value="members">Members</TabsTrigger>
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
				<h2 className="text-xl font-semibold">Project not found</h2>
				<p className="text-muted-foreground mt-2">The requested project could not be found or you don't have access.</p>
				<Link href="/dashboard">
					<Button variant="outline" className="mt-4">
						Return to Dashboard
					</Button>
				</Link>
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
					<CardTitle>Project Details</CardTitle>
					<CardDescription>{project.description || "No description available for this project."}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-2">
						<div className="flex items-center text-sm">
							<Users className="mr-2 h-4 w-4 text-muted-foreground" />
							<span>
								Created by {project.owner.firstName} {project.owner.lastName}
							</span>
						</div>
						<div className="flex items-center text-sm">
							<CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
							<span>{formatDate(project.createdAt, { ignoreTime: true })}</span>
						</div>
						<div className="flex items-center gap-2 mt-2">
							<Badge variant="outline">{project.members.length} members</Badge>
							<Badge variant="outline">
								{project.members.find((m) => m.user._id === project.owner._id)?.role || "owner"}
							</Badge>
						</div>
					</div>
				</CardContent>
			</Card>

			<Tabs defaultValue="tasks">
				<TabsList>
					<TabsTrigger value="tasks">Tasks</TabsTrigger>
					<TabsTrigger value="members">Members</TabsTrigger>
				</TabsList>
				<TabsContent value="tasks" className="mt-4">
					<TaskList projectId={project._id} tasks={tasks} isLoading={isLoading} onRefresh={fetchTasks} />
				</TabsContent>
				<TabsContent value="members" className="mt-4">
					<ProjectMembers projectId={project._id} members={project.members} onRemoveMember={onRemoveMember} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
