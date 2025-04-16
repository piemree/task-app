"use client";

import { TaskLogs } from "@/components/tasks/task-logs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { taskService } from "@/services/task-service";
import type { TaskLogResponse } from "@schemas/task-log.schema";
import type { TaskPriorityEnum, TaskResponse, TaskStatusEnum } from "@schemas/task.schema";
import parse from "html-react-parser";
import { ArrowLeft, CalendarDays, CheckCircle, ChevronDown, Circle, Clock, Edit, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { TiptapEditor } from "../tiptap-editor";
import { AssignTaskDialog } from "./assign-task-dialog";

type TaskDetailProps = {
	projectId: string;
	taskId: string;
	initialTask?: TaskResponse | null;
	initialTaskLogs?: TaskLogResponse[];
};

export function TaskDetail({ projectId, taskId, initialTask, initialTaskLogs }: TaskDetailProps) {
	const [currentTask, setCurrentTask] = useState<TaskResponse | null>(initialTask || null);
	const [taskLogs, setTaskLogs] = useState<TaskLogResponse[]>(initialTaskLogs || []);
	const [activeTab, setActiveTab] = useState("task");
	const [isLoading, setIsLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editDescription, setEditDescription] = useState("");
	const router = useRouter();

	const fetchTask = useCallback(async () => {
		setIsLoading(true);
		try {
			const task = await taskService.getTask(projectId, taskId);
			setCurrentTask(task);
			setEditDescription(task.description);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Task could not be loaded",
				description: "An error occurred while loading task details.",
			});
		} finally {
			setIsLoading(false);
		}
	}, [projectId, taskId]);

	const fetchTaskLogs = useCallback(async () => {
		const logs = await taskService.getTaskLogs(projectId, taskId);
		setTaskLogs(logs);
	}, [projectId, taskId]);

	const handleStatusChange = useCallback(
		async (status: TaskStatusEnum) => {
			if (!currentTask) return;

			setIsLoading(true);
			try {
				await taskService.changeStatus(projectId, taskId, status);
				fetchTask();
				fetchTaskLogs();
				router.refresh();
				// toast({
				// 	title: "Durum güncellendi",
				// 	description: "Görev durumu başarıyla güncellendi.",
				// });
			} catch (error) {
				toast({
					variant: "destructive",
					title: "Status could not be updated",
					description: "An error occurred while updating the task status.",
				});
			} finally {
				setIsLoading(false);
			}
		},
		[currentTask, projectId, taskId, fetchTask, fetchTaskLogs, router],
	);

	const handlePriorityChange = useCallback(
		async (priority: TaskPriorityEnum) => {
			if (!currentTask) return;

			setIsLoading(true);
			try {
				await taskService.changePriority(projectId, taskId, priority);
				fetchTask();
				fetchTaskLogs();
				router.refresh();
				// toast({
				// 	title: "Öncelik güncellendi",
				// 	description: "Görev önceliği başarıyla güncellendi.",
				// });
			} catch (error) {
				toast({
					variant: "destructive",
					title: "Priority could not be updated",
					description: "An error occurred while updating the task priority.",
				});
			} finally {
				setIsLoading(false);
			}
		},
		[currentTask, projectId, taskId, fetchTask, fetchTaskLogs, router],
	);

	const handleDescriptionSave = useCallback(async () => {
		if (!currentTask) return;

		setIsLoading(true);
		try {
			await taskService.updateTask(projectId, taskId, {
				description: editDescription,
			});
			fetchTask();
			setIsEditing(false);
			router.refresh();
			// toast({
			// 	title: "Açıklama güncellendi",
			// 	description: "Görev açıklaması başarıyla güncellendi.",
			// });
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Description could not be updated",
				description: "An error occurred while updating the task description.",
			});
		} finally {
			setIsLoading(false);
		}
	}, [currentTask, editDescription, projectId, taskId, fetchTask, router]);

	const handleCancelEdit = useCallback(() => {
		setIsEditing(false);
		setEditDescription(currentTask?.description || "");
	}, [currentTask]);

	const getStatusIcon = useCallback((status: TaskStatusEnum) => {
		switch (status) {
			case "completed":
				return <CheckCircle className="h-5 w-5 text-green-500" />;
			case "in_progress":
				return <Clock className="h-5 w-5 text-blue-500" />;
			default:
				return <Circle className="h-5 w-5 text-gray-500" />;
		}
	}, []);

	const getPriorityBadge = useCallback((priority: TaskPriorityEnum) => {
		switch (priority) {
			case "high":
				return (
					<Badge variant="destructive" className="bg-red-500 text-white">
						High
					</Badge>
				);
			case "medium":
				return (
					<Badge variant="secondary" className="bg-amber-500 text-white">
						Medium
					</Badge>
				);
			default:
				return (
					<Badge variant="outline" className="bg-gray-500 text-white">
						Low
					</Badge>
				);
		}
	}, []);

	if (isLoading && !currentTask) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<Skeleton className="h-8 w-1/3" />
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
			</div>
		);
	}

	if (!currentTask) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<h2 className="text-xl font-semibold">Task not found</h2>
				<p className="text-muted-foreground mt-2">The requested task could not be found or you don't have access.</p>
				<Link href={`/dashboard/projects/${projectId}`} passHref>
					<Button variant="outline" className="mt-4">
						Return to Project
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<Link href={`/dashboard/projects/${projectId}`} passHref>
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-4 w-4" />
						<span className="sr-only">Back</span>
					</Button>
				</Link>
				<h2 className="text-3xl font-bold tracking-tight">{currentTask.title}</h2>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							{getStatusIcon(currentTask.status)}
							<CardTitle>Task Details</CardTitle>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">Priority:</span>
							{getPriorityBadge(currentTask.priority)}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
										<span className="sr-only">Change Priority</span>
										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => handlePriorityChange("low")}>
										<div className="mr-2 h-3 w-3 rounded-full bg-gray-400" />
										<span>Low</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handlePriorityChange("medium")}>
										<div className="mr-2 h-3 w-3 rounded-full bg-amber-500" />
										<span>Medium</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handlePriorityChange("high")}>
										<div className="mr-2 h-3 w-3 rounded-full bg-red-500" />
										<span>High</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						<div className="flex items-center text-sm">
							<CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
							<span>{formatDate(currentTask.createdAt)}</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">Created by:</span>
							<div className="flex items-center gap-2">
								<Avatar className="h-6 w-6">
									<AvatarFallback className="text-xs">
										{`${currentTask.createdBy.firstName[0] || ""}${currentTask.createdBy.lastName[0] || ""}`.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<span className="text-sm">
									{currentTask.createdBy.firstName} {currentTask.createdBy.lastName}
								</span>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground">Assigned to:</span>
								<div className="flex items-center gap-2">
									<Avatar className="h-6 w-6">
										<AvatarFallback className="text-xs">
											{`${currentTask.assignedTo.firstName[0] || ""}${currentTask.assignedTo.lastName[0] || ""}`.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span className="text-sm">
										{currentTask.assignedTo.firstName} {currentTask.assignedTo.lastName}
									</span>
								</div>
							</div>
							<AssignTaskDialog
								projectId={projectId}
								taskId={taskId}
								currentAssigneeId={currentTask.assignedTo._id}
								onSuccess={() => {
									fetchTask();
									router.refresh();
								}}
							/>
						</div>
					</div>

					<div className="mt-6">
						<h3 className="text-sm font-medium mb-2">Update Status</h3>
						<div className="flex gap-2">
							<Button
								variant={currentTask.status === "pending" ? "default" : "outline"}
								size="sm"
								onClick={() => handleStatusChange("pending")}
							>
								Pending
							</Button>
							<Button
								variant={currentTask.status === "in_progress" ? "default" : "outline"}
								size="sm"
								onClick={() => handleStatusChange("in_progress")}
							>
								In Progress
							</Button>
							<Button
								variant={currentTask.status === "completed" ? "default" : "outline"}
								size="sm"
								onClick={() => handleStatusChange("completed")}
							>
								Completed
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<Tabs defaultValue="task" onValueChange={setActiveTab} value={activeTab}>
				<TabsList>
					<TabsTrigger value="task">Task</TabsTrigger>
					<TabsTrigger value="logs">Task Logs</TabsTrigger>
				</TabsList>
				<TabsContent value="task" className="mt-4">
					<Card>
						<CardHeader className="pb-2">
							<div className="flex justify-between items-center">
								<CardTitle className="text-lg">Description</CardTitle>
								{!isEditing && (
									<Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 w-8 p-0">
										<Edit className="h-4 w-4" />
										<span className="sr-only">Edit</span>
									</Button>
								)}
							</div>
						</CardHeader>
						<CardContent>
							{isEditing ? (
								<div className="space-y-4">
									<TiptapEditor
										value={editDescription}
										onChange={setEditDescription}
										placeholder="Task description..."
										acceptHeading={true}
									/>
									<div className="flex justify-end gap-2">
										<Button size="sm" variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
											<X className="mr-2 h-4 w-4" />
											Cancel
										</Button>
										<Button size="sm" onClick={handleDescriptionSave} disabled={isLoading}>
											<Save className="mr-2 h-4 w-4" />
											Save
										</Button>
									</div>
								</div>
							) : (
								<div className="prose prose-sm dark:prose-invert w-full max-w-none">
									{parse(currentTask.description)}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="logs" className="mt-4">
					<TaskLogs taskLogs={taskLogs} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
