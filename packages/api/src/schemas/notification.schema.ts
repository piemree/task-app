import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { objectIdSchema } from "./mongoose.schema";
import { logActionEnumSchema } from "./task-log.schema";

extendZodWithOpenApi(z);

export const notificationDbSchema = z.object({
	project: objectIdSchema,
	task: objectIdSchema,
	user: objectIdSchema,
	action: logActionEnumSchema,
	isRead: z.boolean().default(false),
	createdAt: z.date().optional().openapi({
		example: "2021-01-01",
	}),
	updatedAt: z.date().optional().openapi({
		example: "2021-01-01",
	}),
});

export const notificationSocketSchema = notificationDbSchema.omit({ user: true, isRead: true });

export type NotificationInput = z.infer<typeof notificationDbSchema>;
export type NotificationSocketInput = z.infer<typeof notificationSocketSchema>;
