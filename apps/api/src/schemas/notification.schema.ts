import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { userResponseSchema } from "./auth.schema";
import { objectIdSchema } from "./mongoose.schema";
import { projectDbSchema } from "./project.schema";
import { logActionEnumSchema } from "./task-log.schema";
import { taskDbSchema } from "./task.schema";

extendZodWithOpenApi(z);

export const notificationDbSchema = z.object({
	_id: objectIdSchema,
	project: objectIdSchema,
	task: objectIdSchema,
	user: objectIdSchema,
	action: logActionEnumSchema,
	isRead: z.boolean().default(false),
	createdAt: z.date().openapi({
		example: "2021-01-01",
	}),
	updatedAt: z.date().openapi({
		example: "2021-01-01",
	}),
});

const notificationSocketSchema = notificationDbSchema.omit({
	_id: true,
	createdAt: true,
	updatedAt: true,
	user: true,
	isRead: true,
});

export const notificationResponseSchema = notificationDbSchema.extend({
	user: userResponseSchema,
	task: taskDbSchema,
	project: projectDbSchema,
});

export const notificationListResponseSchema = z.array(notificationResponseSchema);

const notificationInputSchema = notificationDbSchema.omit({
	_id: true,
	createdAt: true,
	updatedAt: true,
});

export type NotificationDbSchema = z.infer<typeof notificationDbSchema>;
export type NotificationInput = z.infer<typeof notificationInputSchema>;
export type NotificationResponse = z.infer<typeof notificationResponseSchema>;
export type NotificationSocketSchema = z.infer<typeof notificationSocketSchema>;
