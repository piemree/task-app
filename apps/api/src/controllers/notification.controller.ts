import type { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

const notificationService = new NotificationService();

export const getNotifications = async (req: Request, res: Response) => {
	const data = await notificationService.getNotifications({
		userId: req.user?._id ?? "",
	});
	res.status(200).json(data);
};

export const getUnreadNotifications = async (req: Request, res: Response) => {
	const data = await notificationService.getUnreadNotifications({
		userId: req.user?._id ?? "",
	});
	res.status(200).json(data);
};

export const markAsRead = async (req: Request, res: Response) => {
	const data = await notificationService.markAsRead({
		userId: req.user?._id ?? "",
	});
	res.status(200).json(data);
};
