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
import { formatDate } from "@/lib/utils";
import { notificationService } from "@/services/notification-service";
import { socketService } from "@/services/socket-service";
import type { NotificationResponse, NotificationSocketSchema } from "@schemas/notification.schema";
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
		if (user) {
			socketService.init({
				user,
				token: localStorage.getItem("token"),
				isLoading: false,
				error: null,
			});

			const unsubscribe = socketService.onProjectNotification((socketData) => {
				notificationService.getUnreadNotifications().then((unreadNotifications) => {
					setNotifications(unreadNotifications);
					setUnreadCount(unreadNotifications.length);
				});

				toast({
					title: "New Notification",
					description: getNotificationDescriptionFromSocket(socketData),
				});
			});

			return () => {
				unsubscribe();
				socketService.disconnect();
			};
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
			setUnreadCount(0);
			setNotifications([]);
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Operation failed",
				description: "Notifications could not be marked as read.",
			});
		}
	};

	const getNotificationText = (notification: NotificationResponse) => {
		switch (notification.action) {
			case "created":
				return `Task "${notification.task?.title}" has been assigned to you.`;
			case "updated":
				return `The status of "${notification.task?.title}" task has been changed.`;
			case "assigned":
				return `You have been invited to "${notification.project.name}" project.`;
			case "deleted":
				return `"${notification.task?.title}" task has been deleted.`;
			case "status_changed":
				return `The status of "${notification.task?.title}" task has been changed.`;
			case "priority_changed":
				return `The priority of "${notification.task?.title}" task has been changed.`;
			default:
				return `There is an update in "${notification.project.name}" project.`;
		}
	};

	const getNotificationDescriptionFromSocket = (socketData: NotificationSocketSchema) => {
		switch (socketData.action) {
			case "created":
				return "A new task has been created.";
			case "updated":
				return "A task has been updated.";
			case "assigned":
				return "You have been invited to a project.";
			case "deleted":
				return "A task has been deleted.";
			case "status_changed":
				return "A task status has been changed.";
			case "priority_changed":
				return "A task priority has been changed.";
			default:
				return "There is an update in the project.";
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
					<span>Notifications</span>
					{unreadCount > 0 && (
						<Button variant="ghost" size="sm" onClick={markAsRead}>
							Mark all as read
						</Button>
					)}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<div className="max-h-[300px] overflow-y-auto">
					{isLoading ? (
						<DropdownMenuItem disabled>Loading...</DropdownMenuItem>
					) : notifications.length === 0 ? (
						<DropdownMenuItem disabled>No notifications</DropdownMenuItem>
					) : (
						notifications.map((notification) => (
							<DropdownMenuItem key={notification._id} className="font-medium bg-muted/50">
								<div className="flex flex-col gap-1">
									<span>{getNotificationText(notification)}</span>
									<span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
								</div>
							</DropdownMenuItem>
						))
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
