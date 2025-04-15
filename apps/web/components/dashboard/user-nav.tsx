"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export function UserNav() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.auth);

	const handleLogout = () => {
		dispatch(logout());
		router.push("/auth/login");
	};

	if (!user) return null;

	const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{user.firstName} {user.lastName}
						</p>
						<p className="text-xs leading-none text-muted-foreground">{user.email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>Profil</DropdownMenuItem>
				<DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>Çıkış Yap</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
