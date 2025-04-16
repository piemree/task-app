"use client";

import { TiptapEditor } from "@/components/tiptap-editor";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { projectService } from "@/services/project-service";
import { taskService } from "@/services/task-service";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProjectResponse } from "@schemas/project.schema";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	title: z.string().min(1, {
		message: "Task title is required.",
	}),
	description: z.string().min(1, {
		message: "Task description is required.",
	}),
	status: z.enum(["pending", "in_progress", "completed"], {
		required_error: "Please select a status.",
	}),
	priority: z.enum(["low", "medium", "high"], {
		required_error: "Please select a priority.",
	}),
	assignedTo: z.string().min(1, {
		message: "Please select a user to assign.",
	}),
});

interface NewTaskDialogProps {
	projectId: string;
	onSuccess: () => void;
}

export function NewTaskDialog({ projectId, onSuccess }: NewTaskDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [project, setProject] = useState<ProjectResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchProject = async () => {
			setIsLoading(true);
			try {
				const project = await projectService.getProject(projectId);
				setProject(project);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
			} finally {
				setIsLoading(false);
			}
		};
		fetchProject();
	}, [projectId]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			status: "pending",
			priority: "medium",
			assignedTo: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			await taskService.createTask(projectId, values);

			toast({
				title: "Task created",
				description: "Task has been created successfully.",
			});
			setIsOpen(false);
			form.reset();
			onSuccess();
			router.refresh();
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Failed to create task",
				description: "An error occurred while creating the task. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Task
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>New Task</DialogTitle>
					<DialogDescription>Add a new task to the project.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Task title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<TiptapEditor
											value={field.value}
											onChange={field.onChange}
											placeholder="Task description..."
											acceptHeading={true}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="pending">Pending</SelectItem>
												<SelectItem value="in_progress">In Progress</SelectItem>
												<SelectItem value="completed">Completed</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="priority"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Priority</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select priority" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="low">Low</SelectItem>
												<SelectItem value="medium">Medium</SelectItem>
												<SelectItem value="high">High</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="assignedTo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Assigned To</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select user" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{project?.members?.map((member) => (
												<SelectItem key={member.user._id} value={member.user._id}>
													{member.user.firstName} {member.user.lastName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Creating..." : "Create Task"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
