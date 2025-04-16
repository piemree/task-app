"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateUser } from "@/lib/redux/slices/authSlice";
import { authService } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
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
	email: z
		.string()
		.email({
			message: "Enter a valid email address.",
		})
		.readonly(),
});

export function ProfileForm() {
	const dispatch = useAppDispatch();
	const { user, isLoading } = useAppSelector((state) => state.auth);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			email: user?.email || "",
		},
	});

	useEffect(() => {
		if (user) {
			form.reset({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email || "",
			});
		}
	}, [user, form]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!user) return;

		try {
			const response = await authService.updateProfile({
				firstName: values.firstName,
				lastName: values.lastName,
			});

			dispatch(
				updateUser({
					...user,
					firstName: response.firstName,
					lastName: response.lastName,
				}),
			);

			toast({
				title: "Profile updated",
				description: "Your profile information has been successfully updated.",
			});
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Profile update failed",
				description: "An error occurred while updating your profile. Please try again.",
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input {...field} />
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
								<Input {...field} />
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
								<Input {...field} disabled />
							</FormControl>
							<FormDescription>Email address cannot be changed.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Updating..." : "Update Profile"}
				</Button>
			</form>
		</Form>
	);
}
