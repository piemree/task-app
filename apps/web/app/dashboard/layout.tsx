import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { NotificationButton } from "@/components/dashboard/notification-button";
import { UserNav } from "@/components/dashboard/user-nav";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type React from "react";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const token = cookieStore.get("token");

	if (!token) {
		redirect("/auth/login");
	}

	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-50 border-b bg-background">
				<div className="container flex h-16 items-center justify-between py-4">
					<div className="flex items-center gap-4">
						<h1 className="text-xl font-bold">Project Management</h1>
					</div>
					<div className="flex items-center gap-4">
						<NotificationButton />
						<UserNav />
					</div>
				</div>
			</header>
			<div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
				<aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
					<DashboardNav />
				</aside>
				<main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
			</div>
		</div>
	);
}
