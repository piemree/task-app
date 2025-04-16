"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { truncateHtml } from "@/lib/utils";
import type { TaskPriorityEnum, TaskResponse, TaskStatusEnum } from "@schemas/task.schema";
import { CalendarDays, CheckCircle, Circle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { NewTaskDialog } from "./new-task-dialog";

interface TaskListProps {
	projectId: string;
	tasks: TaskResponse[];
	isLoading?: boolean;
}

export function TaskList({ projectId, tasks, isLoading }: TaskListProps) {
	const router = useRouter();

	const handleTaskClick = (taskId: string) => {
		router.push(`/dashboard/projects/${projectId}/tasks/${taskId}`);
	};

	const getStatusIcon = (status: TaskStatusEnum) => {
		switch (status) {
			case "completed":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "in_progress":
				return <Clock className="h-4 w-4 text-blue-500" />;
			default:
				return <Circle className="h-4 w-4 text-gray-500" />;
		}
	};

	const getPriorityBadge = (priority: TaskPriorityEnum) => {
		switch (priority) {
			case "high":
				return <Badge variant="destructive">Yüksek</Badge>;
			case "medium":
				return <Badge variant="secondary">Orta</Badge>;
			default:
				return <Badge variant="outline">Düşük</Badge>;
		}
	};

	if (isLoading) {
		return (
			<div className="grid gap-4">
				{[1, 2, 3].map((i) => (
					<Card key={i}>
						<CardHeader className="p-4">
							<Skeleton className="h-5 w-1/3" />
						</CardHeader>
						<CardContent className="p-4 pt-0">
							<Skeleton className="h-4 w-full" />
							<div className="flex items-center justify-between mt-4">
								<Skeleton className="h-8 w-20" />
								<Skeleton className="h-8 w-8 rounded-full" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (tasks && tasks.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Görev Bulunamadı</CardTitle>
					<CardDescription>Bu projede henüz görev bulunmuyor.</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Yeni görev eklemek için "Görev Ekle" butonunu kullanabilirsiniz.
					</p>
				</CardContent>
				<CardFooter>
					<NewTaskDialog projectId={projectId} onSuccess={() => router.refresh()} />
				</CardFooter>
			</Card>
		);
	}

	return (
		<div className="grid gap-4">
			{tasks.map((task) => (
				<Card
					key={task._id}
					className="cursor-pointer hover:bg-muted/50 transition-colors"
					onClick={() => handleTaskClick(task._id)}
				>
					<CardHeader className="p-4 pb-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								{getStatusIcon(task.status)}
								<CardTitle className="text-base">{task.title}</CardTitle>
							</div>
							{getPriorityBadge(task.priority)}
						</div>
					</CardHeader>
					<CardContent className="p-4 pt-2">
						<CardDescription className="line-clamp-2 mb-4">{truncateHtml(task.description)}</CardDescription>
						<div className="flex items-center justify-between">
							<div className="flex items-center text-sm text-muted-foreground">
								<CalendarDays className="mr-1 h-4 w-4" />
								<span>{new Date(task.createdAt).toLocaleDateString("tr-TR")}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-xs text-muted-foreground">Atanan:</span>
								{task.assignedTo && (
									<Avatar className="h-6 w-6">
										<AvatarFallback className="text-xs">
											{`${task.assignedTo.firstName?.[0] || ""}${task.assignedTo.lastName?.[0] || ""}`.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
