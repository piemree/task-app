"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { login, register } from "@/lib/redux/slices/authSlice";
import { projectService } from "@/services/project-service";
import type { IInviteTokenPayload } from "@api/types/token.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const registerFormSchema = z.object({
	firstName: z.string().min(1, {
		message: "Ad alanı zorunludur.",
	}),
	lastName: z.string().min(1, {
		message: "Soyad alanı zorunludur.",
	}),
	email: z.string().email({
		message: "Geçerli bir e-posta adresi girin.",
	}),
	password: z.string().min(8, {
		message: "Şifre en az 8 karakter olmalıdır.",
	}),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface InviteRegisterFormProps {
	tokenPayload: IInviteTokenPayload;
	token: string;
}

export function InviteRegisterForm({ tokenPayload, token }: InviteRegisterFormProps) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { error } = useAppSelector((state) => state.auth);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: tokenPayload.email,
			password: "",
		},
	});

	// Hata mesajını göster
	useEffect(() => {
		if (error) {
			toast({
				variant: "destructive",
				title: "İşlem başarısız",
				description: error || "Bir hata oluştu. Lütfen tekrar deneyin.",
			});
		}
	}, [error]);

	async function onRegisterSubmit(values: RegisterFormValues) {
		try {
			// set loading to true
			setIsLoading(true);
			await dispatch(register(values));
			await projectService.acceptInvite({ inviteToken: token });
			await dispatch(login(form.getValues()));
			toast({
				title: "İşlem başarılı",
				description: "Davet başarıyla kabul edildi.",
			});
			router.push("/dashboard");
		} catch (error) {
			toast({
				variant: "destructive",
				title: "İşlem başarısız",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onRegisterSubmit)} className="space-y-4 w-full">
				<div className="mb-4">
					<p className="text-sm text-muted-foreground mb-2">
						Proje rolünüz: <span className="font-medium text-primary">{tokenPayload.role}</span>
					</p>
				</div>
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ad</FormLabel>
							<FormControl>
								<Input className="h-10" placeholder="Örnek" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="lastName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Soyad</FormLabel>
							<FormControl>
								<Input className="h-10" placeholder="Kullanıcı" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-posta</FormLabel>
							<FormControl>
								<Input className="h-10" placeholder="ornek@sirket.com" disabled {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Şifre</FormLabel>
							<FormControl>
								<Input className="h-10" type="password" placeholder="********" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full h-10 mt-2" disabled={isLoading}>
					{isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol ve Daveti Kabul Et"}
				</Button>
			</form>
		</Form>
	);
}
