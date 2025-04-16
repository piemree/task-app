"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskResponse } from "@schemas/task.schema";
import { useRouter } from "next/navigation";
import { NewTaskDialog } from "./new-task-dialog";
import { TaskCard } from "./task-card";

interface TaskListProps {
	projectId: string;
	tasks: TaskResponse[];
	isLoading?: boolean;
	onRefresh: () => void;
}

export function TaskList({ projectId, tasks, isLoading, onRefresh }: TaskListProps) {
	const router = useRouter();

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
					<CardTitle>No Tasks Found</CardTitle>
					<CardDescription>There are no tasks in this project yet.</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">You can use the "Add Task" button to create a new task.</p>
				</CardContent>
				<CardFooter>
					<NewTaskDialog
						projectId={projectId}
						onSuccess={() => {
							onRefresh();
							router.refresh();
						}}
					/>
				</CardFooter>
			</Card>
		);
	}

	return (
		<div className="grid gap-4">
			{tasks.map((task) => (
				<TaskCard
					key={task._id}
					task={task}
					projectId={projectId}
					onDelete={() => {
						onRefresh();
						router.refresh();
					}}
				/>
			))}
		</div>
	);
}
