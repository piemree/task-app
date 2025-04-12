import { z } from "zod";
import { objectIdSchema } from "./mongoose.schema";
import { projectIdSchema } from "./project.schema";
export const taskStatusEnumSchema = z.enum(["pending", "in_progress", "completed"]).openapi({
	example: "pending",
});

export const taskPriorityEnumSchema = z.enum(["low", "medium", "high"]).openapi({
	example: "medium",
});

export const taskDbSchema = z.object({
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
	createdAt: z.date().optional().describe("").openapi({
		example: "2021-01-01",
	}),
	updatedAt: z.date().optional().describe("Güncellenme tarihi").openapi({
		example: "2021-01-01",
	}),
});

export const createTaskSchema = taskDbSchema.omit({ createdBy: true, project: true, createdAt: true, updatedAt: true });

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

export type TaskStatusEnum = z.infer<typeof taskStatusEnumSchema>;
export type TaskPriorityEnum = z.infer<typeof taskPriorityEnumSchema>;
export type TaskInput = z.infer<typeof taskDbSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ProjectIdAndTaskIdParams = z.infer<typeof projectIdAndTaskIdSchema>;
