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

	// Show error message
	useEffect(() => {
		if (error) {
			toast({
				variant: "destructive",
				title: "Operation failed",
				description: error || "An error occurred. Please try again.",
			});
		}
	}, [error]);

	async function onRegisterSubmit(values: RegisterFormValues) {
		try {
			// set loading to true
			setIsLoading(true);

			// Register and wait for the result
			await dispatch(register(values)).unwrap();

			// Accept the invitation
			await projectService.acceptInvite({ inviteToken: token });

			// Login - add error handling with unwrap
			await dispatch(login(form.getValues())).unwrap();

			toast({
				title: "Operation successful",
				description: "Invitation accepted successfully.",
			});
			router.push("/dashboard");
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Operation failed",
				description: error instanceof Error ? error.message : "An error occurred. Please try again.",
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
						Your project role: <span className="font-medium text-primary">{tokenPayload.role}</span>
					</p>
				</div>
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input className="h-10" placeholder="John" {...field} />
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
								<Input className="h-10" placeholder="Doe" {...field} />
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
								<Input className="h-10" placeholder="example@company.com" disabled {...field} />
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
								<Input className="h-10" type="password" placeholder="********" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full h-10 mt-2" disabled={isLoading}>
					{isLoading ? "Registering..." : "Register and Accept Invitation"}
				</Button>
			</form>
		</Form>
	);
}
