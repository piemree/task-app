import express, { type Router } from "express";
import { getUserProfile, login, register } from "../controllers/auth.controller";
import { auth } from "../middlewares/auth.middleware";

import { registry } from "../openapi";
import { loginSchema } from "../schemas/auth.schema";
import { registerSchema } from "../schemas/auth.schema";

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
					schema: registry.register("RegisterSchema", registerSchema),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Successful registration",
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
					schema: registry.register("LoginSchema", loginSchema),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Successful login. You can copy the returned token and paste it to the Authorize button.",
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
		},
	},
});

// Express rotalarını tanımla
router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getUserProfile);

export default router;
