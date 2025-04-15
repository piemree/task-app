import type { NotificationInput } from "../../schemas/notification.schema";
import type { LogActionEnum } from "../../schemas/task-log.schema";

// Bildirim oluşturma için kullanılacak veriler
export const notificationData: NotificationInput[] = [
	{
		project: "60e5fc41c8a2f0a9c8c8f0b1", // Referans için proje ID'si
		task: "60f5fc41c8a2f0a9c8c8f0c1", // Referans için görev ID'si
		user: "60d5ec41c8a2f0a9c8c8f0a1", // Referans için kullanıcı ID'si
		action: "updated",
		isRead: false,
	},
	{
		project: "60e5fc41c8a2f0a9c8c8f0b2",
		task: "60f5fc41c8a2f0a9c8c8f0c2",
		user: "60d5ec41c8a2f0a9c8c8f0a2",
		action: "status_changed",
		isRead: false,
	},
	{
		project: "60e5fc41c8a2f0a9c8c8f0b3",
		task: "60f5fc41c8a2f0a9c8c8f0c3",
		user: "60d5ec41c8a2f0a9c8c8f0a3",
		action: "assigned",
		isRead: false,
	},
];

// Bildirim eylemleri
export const notificationActions: LogActionEnum[] = [
	"created",
	"updated",
	"status_changed",
	"priority_changed",
	"assigned",
	"deleted",
];
