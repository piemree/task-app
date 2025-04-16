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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	title: z.string().min(1, {
		message: "Görev başlığı zorunludur.",
	}),
	description: z.string().min(1, {
		message: "Görev açıklaması zorunludur.",
	}),
	status: z.enum(["pending", "in_progress", "completed"], {
		required_error: "Durum seçiniz.",
	}),
	priority: z.enum(["low", "medium", "high"], {
		required_error: "Öncelik seçiniz.",
	}),
	assignedTo: z.string().min(1, {
		message: "Atanacak kullanıcı seçiniz.",
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

	useEffect(() => {
		const fetchProject = async () => {
			setIsLoading(true);
			try {
				const project = await projectService.getProject(projectId);
				setProject(project);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Bir hata oluştu");
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
				title: "Görev oluşturuldu",
				description: "Görev başarıyla oluşturuldu.",
			});
			setIsOpen(false);
			form.reset();
			onSuccess();
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Görev oluşturulamadı",
				description: "Görev oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
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
					Görev Ekle
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Yeni Görev</DialogTitle>
					<DialogDescription>Projeye yeni bir görev ekleyin.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Başlık</FormLabel>
									<FormControl>
										<Input placeholder="Görev başlığı" {...field} />
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
									<FormLabel>Açıklama</FormLabel>
									<FormControl>
										<TiptapEditor
											value={field.value}
											onChange={field.onChange}
											placeholder="Görev açıklaması..."
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
										<FormLabel>Durum</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Durum seçin" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="pending">Beklemede</SelectItem>
												<SelectItem value="in_progress">Devam Ediyor</SelectItem>
												<SelectItem value="completed">Tamamlandı</SelectItem>
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
										<FormLabel>Öncelik</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Öncelik seçin" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="low">Düşük</SelectItem>
												<SelectItem value="medium">Orta</SelectItem>
												<SelectItem value="high">Yüksek</SelectItem>
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
									<FormLabel>Atanan Kişi</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Kullanıcı seçin" />
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
								İptal
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Oluşturuluyor..." : "Görev Oluştur"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
