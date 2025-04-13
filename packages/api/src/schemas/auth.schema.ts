// auth.schema.ts
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { objectIdSchema } from "./mongoose.schema";
extendZodWithOpenApi(z);

// Temel kullanıcı şeması - tekrarları önlemek için
export const userDbSchema = z.object({
	_id: objectIdSchema,
	firstName: z.string().min(1).openapi({
		example: "Emre",
	}),
	lastName: z.string().min(1).openapi({
		example: "Demir",
	}),
	password: z.string().min(8).openapi({
		example: "Guclu123Parola!",
	}),
	email: z.string().email().openapi({
		example: "emre.demir@sirket.com",
	}),
	createdAt: z.date().openapi({
		example: "2021-01-01",
	}),
	updatedAt: z.date().openapi({
		example: "2021-01-01",
	}),
});

export const userInputSchema = userDbSchema.omit({ _id: true, createdAt: true, updatedAt: true });

export const loginInputSchema = userDbSchema.pick({ email: true, password: true });

export const registerInputSchema = userDbSchema.omit({ _id: true, createdAt: true, updatedAt: true });

export const userIdSchema = z.object({
	userId: objectIdSchema,
});

export const userResponseSchema = userDbSchema.omit({ password: true });

export const loginResponseSchema = z.object({
	user: userResponseSchema,
	token: z.string(),
});

export const updateUserProfileInputSchema = userDbSchema.pick({ firstName: true, lastName: true });

export type UserDbSchema = z.infer<typeof userDbSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
export type UserInput = z.infer<typeof userInputSchema>;
export type UserIdParams = z.infer<typeof userIdSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof userResponseSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileInputSchema>;
