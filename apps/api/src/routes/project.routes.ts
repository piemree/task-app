import express, { type Router } from "express";
import {
	acceptInvite,
	createProject,
	deleteProject,
	getProject,
	getProjects,
	inviteUser,
	removeMember,
	updateProject,
} from "../controllers/project.controller";
import { auth } from "../middlewares/auth.middleware";
import { adminAccess, managerAccess, protectProject } from "../middlewares/protect-project.middleware";
import { registry } from "../openapi";
import { successResponseSchema } from "../schemas/helper.schema";
import {
	inviteTokenSchema,
	inviteUserSchema,
	projectIdSchema,
	projectInputSchema,
	projectListResponseSchema,
	projectResponseSchema,
	removeMemberSchema,
	updateProjectSchema,
} from "../schemas/project.schema";

const router: Router = express.Router();

// OpenAPI rotalarını tanımla
registry.registerPath({
	tags: ["Projects"],
	method: "post",
	path: "/api/projects",
	description: "Create new project",
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: registry.register("CreateProjectSchema", projectInputSchema),
				},
			},
		},
	},
	responses: {
		201: {
			description: "Project successfully created",
			content: {
				"application/json": {
					schema: registry.register("ProjectResponse", projectResponseSchema),
				},
			},
		},
	},
});

registry.registerPath({
	tags: ["Projects"],
	method: "put",
	path: "/api/projects/{projectId}",
	description: "Update project",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("ProjectIdSchema", projectIdSchema),
		body: {
			content: {
				"application/json": {
					schema: registry.register("UpdateProjectSchema", updateProjectSchema),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Project successfully updated",
			content: {
				"application/json": {
					schema: registry.register("ProjectResponse", projectResponseSchema),
				},
			},
		},
	},
});

registry.registerPath({
	tags: ["Projects"],
	method: "get",
	path: "/api/projects/{projectId}",
	description: "Get project details",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("ProjectIdSchema", projectIdSchema),
	},
	responses: {
		200: {
			description: "Project details successfully retrieved",
			content: {
				"application/json": {
					schema: registry.register("ProjectResponse", projectResponseSchema),
				},
			},
		},
	},
});

registry.registerPath({
	tags: ["Projects"],
	method: "get",
	path: "/api/projects",
	description: "Get all projects",
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "Projects successfully retrieved",
			content: {
				"application/json": {
					schema: registry.register("ProjectListResponse", projectListResponseSchema),
				},
			},
		},
	},
});

registry.registerPath({
	tags: ["Projects"],
	method: "post",
	path: "/api/projects/{projectId}/invite",
	description: "Invite project members",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("ProjectIdSchema", projectIdSchema),
		body: {
			content: {
				"application/json": {
					schema: registry.register("InviteUserSchema", inviteUserSchema),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Invite project members",
			content: {
				"application/json": {
					schema: registry.register("SuccessResponse", successResponseSchema),
				},
			},
		},
	},
});

registry.registerPath({
	tags: ["Projects"],
	method: "delete",
	path: "/api/projects/{projectId}",
	description: "Delete project",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("ProjectIdSchema", projectIdSchema),
	},
	responses: {
		200: {
			description: "Project successfully deleted",
			content: {
				"application/json": {
					schema: registry.register("SuccessResponse", successResponseSchema),
				},
			},
		},
	},
});

registry.registerPath({
	tags: ["Projects"],
	method: "post",
	path: "/api/projects/accept-invite",
	description: "Become a project member using invite token",
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: registry.register("InviteTokenSchema", inviteTokenSchema),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Became project member",
			content: {
				"application/json": {
					schema: registry.register("SuccessResponse", successResponseSchema),
				},
			},
		},
	},
});

registry.registerPath({
	tags: ["Projects"],
	method: "delete",
	path: "/api/projects/{projectId}/members/{userId}",
	description: "Delete project members",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("RemoveMemberSchema", removeMemberSchema),
	},
	responses: {
		200: {
			description: "Project member deleted",
			content: {
				"application/json": {
					schema: registry.register("SuccessResponse", successResponseSchema),
				},
			},
		},
	},
});

router.post("/", auth, createProject);
router.put("/:projectId", auth, managerAccess, updateProject);
router.get("/:projectId", auth, getProject);
router.get("/", auth, getProjects);
router.post("/:projectId/invite", auth, managerAccess, inviteUser);
router.post("/accept-invite", acceptInvite);
router.delete("/:projectId", auth, adminAccess, deleteProject);
router.delete("/:projectId/members/:userId", auth, managerAccess, removeMember);

export default router;
