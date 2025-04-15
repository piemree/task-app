"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { authService } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
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

export function RegisterForm() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state) => state.auth);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await authService.register(values);
			toast({
				title: "Kayıt başarılı",
				description: "Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.",
			});
			router.push("/auth/login");
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Kayıt başarısız",
				description: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.",
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ad</FormLabel>
							<FormControl>
								<Input placeholder="Emre" {...field} />
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
								<Input placeholder="Demir" {...field} />
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
								<Input placeholder="ornek@sirket.com" {...field} />
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
								<Input type="password" placeholder="********" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
				</Button>
			</form>
		</Form>
	);
}
