import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDate, truncateHtml } from "@/lib/utils";
import { taskService } from "@/services/task-service";
import type { TaskPriorityEnum, TaskResponse, TaskStatusEnum } from "@schemas/task.schema";
import { CalendarDays, CheckCircle, Circle, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "../../hooks/use-toast";

interface TaskCardProps {
	task: TaskResponse;
	projectId: string;
	onDelete: () => void;
}

export function TaskCard({ task, projectId, onDelete }: TaskCardProps) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
				return <Badge variant="destructive">High</Badge>;
			case "medium":
				return <Badge variant="secondary">Medium</Badge>;
			default:
				return <Badge variant="outline">Low</Badge>;
		}
	};

	const handleDelete = async () => {
		try {
			await taskService.deleteTask(projectId, task._id);
			onDelete();
			toast({
				title: "Task successfully deleted",
			});
		} catch (error) {
			toast({
				title: "Task deletion error",
			});
		}
	};

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDeleteDialogOpen(true);
	};

	return (
		<>
			<ConfirmDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={handleDelete}
				title="Delete Task"
				description="Are you sure you want to delete this task? This action cannot be undone."
				confirmText="Delete"
				cancelText="Cancel"
				variant="destructive"
			/>

			<div className="relative group">
				<Link href={`/dashboard/projects/${projectId}/tasks/${task._id}`} className="block">
					<Card className="cursor-pointer hover:bg-muted/50 transition-colors">
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
									<span>{formatDate(task.createdAt)}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-xs text-muted-foreground">Assigned to:</span>
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
				</Link>
				<Button
					variant="destructive"
					size="icon"
					className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
					onClick={handleDeleteClick}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		</>
	);
}
