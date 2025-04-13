import express, { type Router } from "express";
import { getTaskLogs } from "../controllers/task-logs.controller";
import { auth } from "../middlewares/auth.middleware";
import { developerAccess } from "../middlewares/protect-project.middleware";
import { registry } from "../openapi";
import { taskLogListResponseSchema } from "../schemas/task-log.schema";
import { projectIdAndTaskIdSchema } from "../schemas/task.schema";

const router: Router = express.Router({ mergeParams: true });

registry.registerPath({
	tags: ["TaskLogs"],
	method: "get",
	path: "/api/projects/{projectId}/tasks/{taskId}/logs",
	description: "Get task logs",
	security: [{ bearerAuth: [] }],
	request: {
		params: registry.register("ProjectIdAndTaskIdSchema", projectIdAndTaskIdSchema),
	},
	responses: {
		200: {
			description: "Task logs successfully retrieved",
			content: {
				"application/json": {
					schema: registry.register("TaskLogListResponse", taskLogListResponseSchema),
				},
			},
		},
	},
});

// Express rotalarını tanımla
router.get("/", auth, developerAccess, getTaskLogs);

export default router;
