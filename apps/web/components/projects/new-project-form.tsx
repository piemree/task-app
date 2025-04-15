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
		message: "Proje adı zorunludur.",
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
				title: "Proje oluşturuldu",
				description: "Proje başarıyla oluşturuldu.",
			});
			router.push(`/dashboard/projects/${result._id}`);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Proje oluşturulamadı",
				description: "Proje oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
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
							<FormLabel>Proje Adı</FormLabel>
							<FormControl>
								<Input placeholder="Web Uygulaması" {...field} />
							</FormControl>
							<FormDescription>Projenizin adı. Bu, projenizi tanımlamak için kullanılacaktır.</FormDescription>
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
								<Textarea placeholder="Projenizin açıklaması..." className="resize-none" {...field} />
							</FormControl>
							<FormDescription>Projenizin kısa bir açıklaması. Bu isteğe bağlıdır.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Oluşturuluyor..." : "Proje Oluştur"}
				</Button>
			</form>
		</Form>
	);
}
