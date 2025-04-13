import type { NotificationResponse } from "@schemas/notification.schema";
import { api } from "../lib/api";

export const notificationService = {
	getNotifications: async () => {
		const response = await api.get<NotificationResponse[]>("/notifications");
		return response;
	},

	getUnreadNotifications: async () => {
		const response = await api.get<NotificationResponse[]>("/notifications/unread");
		return response;
	},

	markAsRead: async () => {
		const response = await api.post<NotificationResponse[]>("/notifications/read");
		return response;
	},
};
