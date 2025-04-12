import { z } from "zod";
import { objectIdSchema } from "./mongoose.schema";
import { taskPriorityEnumSchema, taskStatusEnumSchema } from "./task.schema";

// LogAction için zod enum
export const logActionEnumSchema = z
	.enum(["created", "updated", "status_changed", "priority_changed", "assigned", "deleted"])
	.openapi({
		example: "updated",
	});

// Task için değişiklik alanlarının şeması
export const taskChangesSchema = z
	.object({
		title: z.string().optional(),
		description: z.string().optional(),
		status: taskStatusEnumSchema.optional(),
		priority: taskPriorityEnumSchema.optional(),
		assignedTo: objectIdSchema.optional(),
	})
	.partial()
	.openapi({
		example: { title: "Old Title", description: "Old Description" },
	});

// TaskLog için temel şema
export const taskLogDbSchema = z.object({
	task: objectIdSchema,
	action: logActionEnumSchema,
	previousStatus: taskStatusEnumSchema.optional(),
	newStatus: taskStatusEnumSchema.optional(),
	previousPriority: taskPriorityEnumSchema.optional(),
	newPriority: taskPriorityEnumSchema.optional(),
	previousAssignee: objectIdSchema.optional(),
	newAssignee: objectIdSchema.optional(),
	changedBy: objectIdSchema,
	changes: taskChangesSchema,
	createdAt: z.date().optional().openapi({
		example: "2023-05-10T15:30:00Z",
	}),
	updatedAt: z.date().optional().openapi({
		example: "2023-05-10T15:30:00Z",
	}),
});

// TaskLog oluşturma şeması
export const createTaskLogSchema = taskLogDbSchema.omit({
	createdAt: true,
	updatedAt: true,
});

// ID ile TaskLog getirme şeması
export const getTaskLogByIdSchema = z.object({
	id: objectIdSchema,
});

export const getTaskLogsParamsSchema = z.object({
	projectId: objectIdSchema,
	taskId: objectIdSchema,
});

// Type tanımlamaları
export type LogActionEnum = z.infer<typeof logActionEnumSchema>;
export type TaskLogInput = z.infer<typeof taskLogDbSchema>;
export type CreateTaskLogInput = z.infer<typeof createTaskLogSchema>;
export type GetTaskLogByIdParams = z.infer<typeof getTaskLogByIdSchema>;
export type GetTaskLogsByTaskParams = z.infer<typeof getTaskLogsParamsSchema>;
export type TaskChanges = z.infer<typeof taskChangesSchema>;
