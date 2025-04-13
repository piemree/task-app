import { z } from "zod";
import { userResponseSchema } from "./auth.schema";
import { objectIdSchema } from "./mongoose.schema";
import { projectDbSchema, projectIdSchema, projectResponseSchema } from "./project.schema";
export const taskStatusEnumSchema = z.enum(["pending", "in_progress", "completed"]).openapi({
	example: "pending",
});

export const taskPriorityEnumSchema = z.enum(["low", "medium", "high"]).openapi({
	example: "medium",
});

export const taskDbSchema = z.object({
	_id: objectIdSchema,
	title: z.string().openapi({
		example: "Task 1",
	}),
	description: z.string().openapi({
		example: "Task 1 description",
	}),
	status: taskStatusEnumSchema.default("pending").openapi({
		example: "pending",
	}),
	priority: taskPriorityEnumSchema.default("medium").openapi({
		example: "medium",
	}),
	project: objectIdSchema,
	assignedTo: objectIdSchema,
	createdBy: objectIdSchema,
	createdAt: z.date().openapi({
		example: "2021-01-01",
	}),
	updatedAt: z.date().openapi({
		example: "2021-01-01",
	}),
});

export const taskInputSchema = taskDbSchema.omit({
	_id: true,
	createdBy: true,
	project: true,
	createdAt: true,
	updatedAt: true,
});

export const projectIdAndTaskIdSchema = projectIdSchema.extend({
	taskId: objectIdSchema,
});

export const taskStatusSchema = z.object({
	status: taskStatusEnumSchema,
});

export const taskPrioritySchema = z.object({
	priority: taskPriorityEnumSchema,
});

export const updateTaskSchema = taskDbSchema
	.pick({
		title: true,
		description: true,
	})
	.partial();

export const taskResponseSchema = taskDbSchema.extend({
	assignedTo: userResponseSchema,
	createdBy: userResponseSchema,
	project: projectDbSchema,
});

export const taskListResponseSchema = z.array(taskResponseSchema);

export type TaskStatusEnum = z.infer<typeof taskStatusEnumSchema>;
export type TaskPriorityEnum = z.infer<typeof taskPriorityEnumSchema>;
export type TaskInput = z.infer<typeof taskInputSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ProjectIdAndTaskIdParams = z.infer<typeof projectIdAndTaskIdSchema>;
export type TaskResponse = z.infer<typeof taskResponseSchema>;
export type TaskDbSchema = z.infer<typeof taskDbSchema>;
