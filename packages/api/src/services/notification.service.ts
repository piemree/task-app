import type { Server } from "socket.io";
import { getIO } from "../config/socket";
import { Notification } from "../models/notification.model";
import type { IProject } from "../models/project.model";
import type { ITask } from "../models/task.model";
import type { IUser } from "../models/user.model";
import type { NotificationInput, NotificationResponse, NotificationSocketSchema } from "../schemas/notification.schema";

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

	public async sendProjectNotification(args: { data: NotificationSocketSchema }) {
		const io = this.getSocketIO();
		if (io) {
			io.to(`project:${args.data.project}`).emit("project-notification", args.data);
		}
	}

	private async findManyNotification(args: { userId?: string; isRead?: boolean }): Promise<NotificationResponse[]> {
		const query = {};

		if (args.userId) {
			Object.assign(query, { user: args.userId });
		}

		if (args.isRead !== undefined) {
			Object.assign(query, { isRead: args.isRead });
		}

		const notifications = await Notification.find(query)
			.populate<{ user: IUser }>({ path: "user", select: "-password" })
			.populate<{ task: ITask }>({ path: "task" })
			.populate<{ project: IProject }>({ path: "project" });

		return notifications;
	}

	public async markAsRead(args: { userId: string }) {
		await Notification.updateMany({ user: args.userId }, { isRead: true });
		return { success: true };
	}

	public async getNotifications(args: { userId: string }) {
		const notifications = await this.findManyNotification({ userId: args.userId });
		return notifications;
	}

	public async getUnreadNotifications(args: { userId: string }) {
		const notifications = await this.findManyNotification({ userId: args.userId, isRead: false });
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
