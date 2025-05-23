"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { login } from "@/lib/redux/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	email: z.string().email({
		message: "Enter a valid email address.",
	}),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
});

export function LoginForm() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { isLoading, error, token } = useAppSelector((state) => state.auth);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// Show error message
	useEffect(() => {
		if (error) {
			toast({
				variant: "destructive",
				title: "Login failed",
				description: error || "Email or password is incorrect.",
			});
		}
	}, [error]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await dispatch(login(values));
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="example@company.com" {...field} />
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
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="********" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Logging in..." : "Login"}
				</Button>
			</form>
		</Form>
	);
}
