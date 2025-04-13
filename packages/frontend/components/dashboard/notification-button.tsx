"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/redux/hooks";
import { notificationService } from "@/services/notification-service";
import type { NotificationResponse } from "@schemas/notification.schema";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export function NotificationButton() {
	const { user } = useAppSelector((state) => state.auth);
	const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const fetchNotifications = async () => {
			setIsLoading(true);
			const unreadNotifications = await notificationService.getUnreadNotifications();
			setNotifications(unreadNotifications);
			setUnreadCount(unreadNotifications.length);
			setIsLoading(false);
		};

		if (user) {
			fetchNotifications();
		}
	}, [user]);

	useEffect(() => {
		const refreshNotifications = async () => {
			if (user && isOpen) {
				setIsLoading(true);
				const unreadNotifications = await notificationService.getUnreadNotifications();
				setNotifications(unreadNotifications);
				setUnreadCount(unreadNotifications.length);
				setIsLoading(false);
			}
		};

		refreshNotifications();
	}, [user, isOpen]);

	const markAsRead = async () => {
		try {
			await notificationService.markAsRead();
		} catch (error) {
			toast({
				variant: "destructive",
				title: "İşlem başarısız",
				description: "Bildirimler okundu olarak işaretlenemedi.",
			});
		}
	};

	const getNotificationText = (notification: NotificationResponse) => {
		switch (notification.action) {
			case "created":
				return `Size "${notification.task?.title}" görevi atandı.`;
			case "updated":
				return `"${notification.task?.title}" görevinin durumu değiştirildi.`;
			case "assigned":
				return `"${notification.project.name}" projesine davet edildiniz.`;
			case "deleted":
				return `"${notification.task?.title}" görev silindi.`;
			case "status_changed":
				return `"${notification.task?.title}" görevinin durumu değiştirildi.`;
			case "priority_changed":
				return `"${notification.task?.title}" görevinin önceliği değiştirildi.`;
			default:
				return `"${notification.project.name}" projesinde bir güncelleme var.`;
		}
	};

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
							{unreadCount}
						</span>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<DropdownMenuLabel className="flex items-center justify-between">
					<span>Bildirimler</span>
					{unreadCount > 0 && (
						<Button variant="ghost" size="sm" onClick={markAsRead}>
							Tümünü okundu işaretle
						</Button>
					)}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<div className="max-h-[300px] overflow-y-auto">
					{isLoading ? (
						<DropdownMenuItem disabled>Yükleniyor...</DropdownMenuItem>
					) : notifications.length === 0 ? (
						<DropdownMenuItem disabled>Bildirim yok</DropdownMenuItem>
					) : (
						notifications.map((notification) => (
							<DropdownMenuItem key={notification._id} className="font-medium bg-muted/50">
								<div className="flex flex-col gap-1">
									<span>{getNotificationText(notification)}</span>
									<span className="text-xs text-muted-foreground">
										{new Date(notification.createdAt).toLocaleString("tr-TR")}
									</span>
								</div>
							</DropdownMenuItem>
						))
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
