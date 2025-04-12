import express, { type Router } from "express";
import {
	changeAssignedUser,
	changeTaskPriority,
	changeTaskStatus,
	createTask,
	deleteTask,
	getTask,
	getTasks,
	updateTask,
} from "../controllers/task.controller";
import { auth } from "../middlewares/auth.middleware";
import { adminAccess, developerAccess, managerAccess, protectProject } from "../middlewares/protect-project.middleware";
import { registry } from "../openapi";
import { userIdSchema } from "../schemas/auth.schema";
import { projectIdSchema, userProjectRoleSchema } from "../schemas/project.schema";
import {
	createTaskSchema,
	projectIdAndTaskIdSchema,
	taskPrioritySchema,
	taskStatusSchema,
	updateTaskSchema,
} from "../schemas/task.schema";

const router: Router = express.Router({ mergeParams: true });

// create task
registry.registerPath({
	tags: ["Tasks"],
	method: "post",
	path: "/api/projects/{projectId}/tasks",
	description: "Create new task",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("ProjectIdSchema", projectIdSchema),
		body: {
			content: {
				"application/json": {
					schema: registry.register("CreateTaskSchema", createTaskSchema),
				},
			},
		},
	},
	responses: {
		201: {
			description: "Task successfully created",
		},
	},
});

// update task
registry.registerPath({
	tags: ["Tasks"],
	method: "put",
	path: "/api/projects/{projectId}/tasks/{taskId}",
	description: "Update task",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("ProjectIdAndTaskIdSchema", projectIdAndTaskIdSchema),
		body: {
			content: {
				"application/json": {
					schema: registry.register("UpdateTaskSchema", updateTaskSchema),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Task successfully updated",
		},
	},
});

// get task
registry.registerPath({
	tags: ["Tasks"],
	method: "get",
	path: "/api/projects/{projectId}/tasks/{taskId}",
	description: "Get task details",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("ProjectIdAndTaskIdSchema", projectIdAndTaskIdSchema),
	},
	responses: {
		200: {
			description: "Task details successfully retrieved",
		},
	},
});

// get tasks
registry.registerPath({
	tags: ["Tasks"],
	method: "get",
	path: "/api/projects/{projectId}/tasks",
	description: "Get all tasks for the project",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("ProjectIdSchema", projectIdSchema),
	},
	responses: {
		200: {
			description: "Tasks successfully retrieved",
		},
	},
});

// change task status
registry.registerPath({
	tags: ["Tasks"],
	method: "put",
	path: "/api/projects/{projectId}/tasks/{taskId}/status",
	description: "Change task status",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("ProjectIdAndTaskIdSchema", projectIdAndTaskIdSchema),
		body: {
			content: {
				"application/json": {
					schema: registry.register("TaskStatusSchema", taskStatusSchema),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Task status changed",
		},
	},
});

// change assigned user
registry.registerPath({
	tags: ["Tasks"],
	method: "put",
	path: "/api/projects/{projectId}/tasks/{taskId}/assigned-to",
	description: "Change assigned user for the task",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("ProjectIdAndTaskIdSchema", projectIdAndTaskIdSchema),
		body: {
			content: {
				"application/json": {
					schema: registry.register("UserIdSchema", userIdSchema),
				},
			},
		},
	},
	responses: {
		200: {
			description: "Task assigned user changed",
		},
	},
});

// change task priority
registry.registerPath({
	tags: ["Tasks"],
	method: "put",
	path: "/api/projects/{projectId}/tasks/{taskId}/priority",
	description: "Change task priority",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("ProjectIdAndTaskIdSchema", projectIdAndTaskIdSchema),
		body: {
			content: { "application/json": { schema: registry.register("TaskPrioritySchema", taskPrioritySchema) } },
		},
	},
	responses: {
		200: {
			description: "Task priority changed",
		},
	},
});

// Express rotalarını tanımla
router.post("/", auth, managerAccess, createTask);
router.put("/:taskId", auth, managerAccess, updateTask);
router.get("/:taskId", auth, developerAccess, getTask);
router.get("/", auth, developerAccess, getTasks);
router.put("/:taskId/status", auth, developerAccess, changeTaskStatus);
router.put("/:taskId/assigned-to", auth, managerAccess, changeAssignedUser);
router.put("/:taskId/priority", auth, managerAccess, changeTaskPriority);
router.delete("/:taskId", auth, managerAccess, deleteTask);
export default router;
