"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateToken, updateUser } from "@/lib/redux/slices/authSlice";
import { authService } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	email: z.string().email({
		message: "Geçerli bir e-posta adresi girin.",
	}),
	password: z.string().min(8, {
		message: "Şifre en az 8 karakter olmalıdır.",
	}),
});

export function LoginForm() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { isLoading, error } = useAppSelector((state) => state.auth);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await authService.login({ email: values.email, password: values.password });
			localStorage.setItem("token", response.token);
			document.cookie = `token=${response.token}; path=/; max-age=86400`;
			dispatch(updateUser(response.user));
			dispatch(updateToken(response.token));
			toast({
				title: "Giriş başarılı",
				description: "Hoş geldiniz!",
			});
			router.push("/dashboard");
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Giriş başarısız",
				description: "E-posta veya şifre hatalı.",
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
					{isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
				</Button>
			</form>
		</Form>
	);
}
