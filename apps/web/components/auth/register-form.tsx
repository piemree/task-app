"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { login, register } from "@/lib/redux/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	firstName: z.string().min(1, {
		message: "First name is required.",
	}),
	lastName: z.string().min(1, {
		message: "Last name is required.",
	}),
	email: z.string().email({
		message: "Enter a valid email address.",
	}),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
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

	// Show error message
	useEffect(() => {
		if (error) {
			toast({
				variant: "destructive",
				title: "Registration failed",
				description: error || "An error occurred during registration. Please try again.",
			});
		}
	}, [error]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await dispatch(register(values)).unwrap();

			// If registration is successful
			toast({
				title: "Registration successful",
				description: "Your account has been created. Logging you in automatically...",
			});

			// Using unwrap for login to handle errors
			await dispatch(login(values)).unwrap();
			router.push("/dashboard");
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Registration failed",
				description: error instanceof Error ? error.message : "An error occurred. Please try again.",
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
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input placeholder="John" {...field} />
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
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input placeholder="Doe" {...field} />
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
					{isLoading ? "Registering..." : "Register"}
				</Button>
			</form>
		</Form>
	);
}
