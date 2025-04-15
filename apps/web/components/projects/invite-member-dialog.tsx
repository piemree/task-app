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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { projectService } from "@/services/project-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	email: z.string().email({
		message: "Geçerli bir e-posta adresi giriniz.",
	}),
	role: z.enum(["admin", "manager", "developer"], {
		required_error: "Rol seçiniz.",
	}),
});

export function InviteMemberDialog({ projectId }: { projectId: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			role: "developer",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			await projectService.inviteUser(projectId, values);

			toast({
				title: "Davet gönderildi",
				description: "Kullanıcı projeye başarıyla davet edildi.",
			});
			setIsOpen(false);
			form.reset();
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Davet gönderilemedi",
				description: "Kullanıcı davet edilirken bir hata oluştu. Lütfen tekrar deneyin.",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="sm">
					<UserPlus className="mr-2 h-4 w-4" />
					Üye Davet Et
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Üye Davet Et</DialogTitle>
					<DialogDescription>Projeye yeni bir üye davet edin.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>E-posta Adresi</FormLabel>
									<FormControl>
										<Input placeholder="ornek@mail.com" type="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Rol</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Rol seçin" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="admin">Admin</SelectItem>
											<SelectItem value="manager">Yönetici</SelectItem>
											<SelectItem value="developer">Geliştirici</SelectItem>
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
								{isLoading ? "Davet Gönderiliyor..." : "Davet Gönder"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
