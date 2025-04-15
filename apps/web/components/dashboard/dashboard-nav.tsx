"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FolderPlus, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Yeni Proje",
		href: "/dashboard/projects/new",
		icon: FolderPlus,
	},
	{
		title: "Profil",
		href: "/dashboard/profile",
		icon: Users,
	},
];

export function DashboardNav() {
	const pathname = usePathname();

	return (
		<nav className="grid items-start gap-2 p-4">
			{items.map((item, index) => {
				const Icon = item.icon;
				return (
					<Link key={item.title} href={item.href}>
						<Button
							variant={pathname === item.href ? "secondary" : "ghost"}
							className={cn("w-full justify-start gap-2", pathname === item.href && "bg-muted")}
						>
							<Icon className="h-4 w-4" />
							{item.title}
						</Button>
					</Link>
				);
			})}
		</nav>
	);
}
