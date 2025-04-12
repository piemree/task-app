// auth.schema.ts
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { objectIdSchema } from "./mongoose.schema";
extendZodWithOpenApi(z);

// Temel kullanıcı şeması - tekrarları önlemek için
export const userDbSchema = z.object({
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
});

export const registerSchema = userDbSchema;
export const loginSchema = userDbSchema.pick({ email: true, password: true });

export const userIdSchema = z.object({
	userId: objectIdSchema,
});

export type UserInput = z.infer<typeof userDbSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UserIdParams = z.infer<typeof userIdSchema>;
