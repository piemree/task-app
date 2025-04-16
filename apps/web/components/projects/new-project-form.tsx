"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { projectService } from "@/services/project-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	name: z.string().min(1, {
		message: "Project name is required.",
	}),
	description: z.string().optional(),
});

export function NewProjectForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			const result = await projectService.createProject(values);
			toast({
				title: "Project created",
				description: "Project has been successfully created.",
			});
			router.push(`/dashboard/projects/${result._id}`);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Project creation failed",
				description: "An error occurred while creating the project. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Project Name</FormLabel>
							<FormControl>
								<Input placeholder="Web Application" {...field} />
							</FormControl>
							<FormDescription>The name of your project. This will be used to identify your project.</FormDescription>
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
								<Textarea placeholder="Description of your project..." className="resize-none" {...field} />
							</FormControl>
							<FormDescription>A brief description of your project. This is optional.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Creating..." : "Create Project"}
				</Button>
			</form>
		</Form>
	);
}
