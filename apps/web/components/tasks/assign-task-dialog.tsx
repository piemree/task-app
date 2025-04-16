"use client";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { projectService } from "@/services/project-service";
import { taskService } from "@/services/task-service";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProjectMember } from "@schemas/project.schema";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	userId: z.string({
		required_error: "Please select a user",
	}),
});

type AssignTaskProps = {
	projectId: string;
	taskId: string;
	currentAssigneeId: string;
	onSuccess: () => void;
};

export function AssignTaskDialog({ projectId, taskId, currentAssigneeId, onSuccess }: AssignTaskProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [members, setMembers] = useState<ProjectMember[]>([]);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			userId: "",
		},
	});

	useEffect(() => {
		const fetchProjectMembers = async () => {
			try {
				const project = await projectService.getProject(projectId);
				setMembers(project.members);
			} catch (error) {
				toast({
					variant: "destructive",
					title: "Project members could not be loaded",
					description: "An error occurred while loading project members.",
				});
			}
		};

		if (isOpen) {
			fetchProjectMembers();
		}
	}, [projectId, isOpen]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			await taskService.changeAssignee(projectId, taskId, values.userId);

			// toast({
			// 	title: "Görev atandı",
			// 	description: "Görev başarıyla yeni bir kullanıcıya atandı.",
			// });

			// Dialog kapat ve formu sıfırla
			setIsOpen(false);
			form.reset();
			onSuccess();
			router.refresh();
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Task could not be assigned",
				description: "An error occurred while assigning the task. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="sm" variant="ghost">
					<UserPlus className="h-4 w-4 mr-1" />
					Assign Task
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Assign Task</DialogTitle>
					<DialogDescription>Assign this task to another team member.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="userId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>User</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a user" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{members
												.filter((member) => member.user._id !== currentAssigneeId)
												.map((member) => (
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
								{isLoading ? "Assigning..." : "Assign Task"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
