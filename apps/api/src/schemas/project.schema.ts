import { z } from "zod";
import { userResponseSchema } from "./auth.schema";
import { objectIdSchema } from "./mongoose.schema";

export const userProjectRoleSchema = z.enum(["admin", "manager", "developer"]).describe("Kullanıcı rolü").openapi({
	example: "admin",
});

export const projectDbSchema = z.object({
	_id: objectIdSchema,
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
	createdAt: z.date().openapi({
		example: "2021-01-01",
	}),
	updatedAt: z.date().openapi({
		example: "2021-01-01",
	}),
});

export const projectInputSchema = projectDbSchema.omit({
	_id: true,
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

export const projectMemberSchema = z.object({
	_id: objectIdSchema,
	role: userProjectRoleSchema,
	user: userResponseSchema,
});

export const projectResponseSchema = projectDbSchema.extend({
	owner: userResponseSchema,
	members: z.array(projectMemberSchema),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const projectListResponseSchema = z.array(projectResponseSchema);

export type ProjectRole = z.infer<typeof userProjectRoleSchema>;
export type ProjectDbSchema = z.infer<typeof projectDbSchema>;
export type ProjectMember = z.infer<typeof projectMemberSchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectIdParams = z.infer<typeof projectIdSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type InviteTokenInput = z.infer<typeof inviteTokenSchema>;
