import express, { type Router } from "express";
import { getUserProfile, login, register, updateUserProfile } from "../controllers/auth.controller";
import { auth } from "../middlewares/auth.middleware";

import { registry } from "../openapi";
import {
	loginInputSchema,
	loginResponseSchema,
	updateUserProfileInputSchema,
	userResponseSchema,
} from "../schemas/auth.schema";
import { registerInputSchema } from "../schemas/auth.schema";

const router: Router = express.Router();

// OpenAPI rotalarını tanımla
registry.registerPath({
	tags: ["Authentication"],
	method: "post",
	path: "/api/auth/register",
	description: "New user registration",
	security: [],
	request: {
		body: {
			content: {
				"application/json": {
					schema: registry.register("RegisterSchema", registerInputSchema),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Successful registration",
			content: {
				"application/json": {
					schema: registry.register("RegisterResponse", userResponseSchema),
				},
			},
		},
	},
});

registry.registerPath({
	tags: ["Authentication"],
	method: "post",
	path: "/api/auth/login",
	description: "User login",
	security: [],
	request: {
		body: {
			content: {
				"application/json": {
					schema: registry.register("LoginSchema", loginInputSchema),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Successful login. You can copy the returned token and paste it to the Authorize button.",
			content: {
				"application/json": {
					schema: registry.register("LoginResponse", loginResponseSchema),
				},
			},
		},
	},
});

registry.registerPath({
	tags: ["Authentication"],
	method: "get",
	path: "/api/auth/profile",
	description: "User profile",
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "User profile",
			content: {
				"application/json": {
					schema: registry.register("UserResponse", userResponseSchema),
				},
			},
		},
	},
});

registry.registerPath({
	tags: ["Authentication"],
	method: "put",
	path: "/api/auth/profile",
	description: "Update user profile",
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: registry.register("UpdateUserProfileSchema", updateUserProfileInputSchema),
				},
			},
		},
	},
	responses: {
		200: {
			description: "User profile updated",
			content: {
				"application/json": {
					schema: registry.register("UserResponse", userResponseSchema),
				},
			},
		},
	},
});

// Express rotalarını tanımla
router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);

export default router;
