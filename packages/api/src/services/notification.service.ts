import type { Server, Socket } from "socket.io";
import { getIO } from "../config/socket";
import { Notification } from "../models/notification.model";
import type { NotificationInput, NotificationSocketInput } from "../schemas/notification.schema";

export class NotificationService {
	private io: Server | null = null;

	private getSocketIO(): Server {
		if (!this.io) {
			try {
				this.io = getIO();
			} catch (error) {
				console.warn("Socket.io henüz başlatılmadı. Bildirim gönderilemeyecek.");
			}
		}
		return this.io as Server;
	}

	public async sendProjectNotification(args: { data: NotificationSocketInput }) {
		const io = this.getSocketIO();
		if (io) {
			io.to(`project:${args.data.project}`).emit("project-notification", args.data);
		}
	}

	public async markAsRead(args: { userId: string }) {
		await Notification.updateMany({ user: args.userId }, { isRead: true });
	}

	public async getNotifications(args: { userId: string }) {
		const notifications = await Notification.find({ user: args.userId });
		return notifications;
	}

	public async getUnreadNotifications(args: { userId: string }) {
		const notifications = await Notification.find({ user: args.userId, isRead: false });
		return notifications;
	}

	public async createNotification(args: { data: NotificationInput }) {
		const notification = await Notification.create(args.data);
		return notification;
	}

	public async createBulkNotification(args: { data: NotificationInput[] }) {
		const notifications = await Notification.insertMany(args.data);
		return notifications;
	}
}
