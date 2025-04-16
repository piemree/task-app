"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { cn } from "@/lib/utils";
import { FolderPlus, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const items = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "New Project",
		href: "/dashboard/projects/new",
		icon: FolderPlus,
	},
	{
		title: "Profile",
		href: "/dashboard/profile",
		icon: Users,
	},
];

export function DashboardNav() {
	const pathname = usePathname();
	const dispatch = useAppDispatch();
	const router = useRouter();

	const handleLogout = () => {
		dispatch(logout());
		router.push("/auth/login");
	};

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
			<Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
				<LogOut className="h-4 w-4" />
				Logout
			</Button>
		</nav>
	);
}
