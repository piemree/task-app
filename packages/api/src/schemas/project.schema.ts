import { z } from "zod";
import { objectIdSchema } from "./mongoose.schema";

export const userProjectRoleSchema = z.enum(["admin", "manager", "developer"]).describe("Kullanıcı rolü").openapi({
	example: "admin",
});

export const projectDbSchema = z.object({
	name: z.string().min(1).openapi({
		example: "Project Name",
	}),
	description: z.string().optional().openapi({
		example: "Project Description",
	}),
	owner: objectIdSchema,
	members: z.array(
		z.object({
			user: objectIdSchema,
			role: userProjectRoleSchema,
		}),
	),
	createdAt: z.date().optional().openapi({
		example: "2021-01-01",
	}),
	updatedAt: z.date().optional().openapi({
		example: "2021-01-01",
	}),
});

export const createProjectSchema = projectDbSchema.omit({
	owner: true,
	members: true,
	createdAt: true,
	updatedAt: true,
});

export const updateProjectSchema = projectDbSchema.omit({ owner: true, createdAt: true, updatedAt: true }).partial();

export const projectIdSchema = z.object({
	projectId: objectIdSchema,
});

export const inviteUserSchema = z.object({
	email: z.string().email("Invalid email").openapi({
		example: "test@test.com",
	}),
	role: userProjectRoleSchema,
});

export const inviteTokenSchema = z.object({
	inviteToken: z.string().openapi({
		example: "1234567890",
	}),
});

export const removeMemberSchema = projectIdSchema.extend({
	userId: objectIdSchema,
});

export type ProjectRole = z.infer<typeof userProjectRoleSchema>;

export type ProjectInput = z.infer<typeof projectDbSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectIdParams = z.infer<typeof projectIdSchema>;
