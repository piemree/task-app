import { type Document, Schema, model } from "mongoose";
import type { NotificationDbSchema } from "../schemas/notification.schema";
import { logActionEnumSchema } from "../schemas/task-log.schema";

export interface INotification extends Omit<NotificationDbSchema, "_id">, Document {
	_id: string;
}

const logActionValues = logActionEnumSchema.options;

const notificationSchema = new Schema<INotification>(
	{
		user: { type: String, required: true, ref: "User" },
		project: { type: String, required: true, ref: "Project" },
		task: { type: String, required: true, ref: "Task" },
		action: { type: String, required: true, enum: logActionValues },
		isRead: { type: Boolean, default: false },
	},
	{ timestamps: true, versionKey: false },
);

export const Notification = model<INotification>("Notification", notificationSchema);
