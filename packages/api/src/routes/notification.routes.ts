import express, { type Router } from "express";

import { getUnreadNotifications, markAsRead } from "../controllers/notification.controller";
import { getNotifications } from "../controllers/notification.controller";
import { auth } from "../middlewares/auth.middleware";
import { developerAccess } from "../middlewares/protect-project.middleware";
import { registry } from "../openapi";

const router: Router = express.Router({ mergeParams: true });

// get my notifications
registry.registerPath({
	tags: ["Notification"],
	method: "get",
	path: "/api/projects/{projectId}/notifications",
	description: "Get new notifications",
	security: [{ bearerAuth: [] }],
	responses: {
		201: {
			description: "Notifications successfully retrieved",
		},
	},
});

// get unread notifications count
registry.registerPath({
	tags: ["Notification"],
	method: "get",
	path: "/api/projects/{projectId}/notifications/unread",
	description: "Get unread notifications",
	security: [{ bearerAuth: [] }],
	responses: {
		201: {
			description: "Unread notifications successfully retrieved",
		},
	},
});

// mark as read
registry.registerPath({
	tags: ["Notification"],
	method: "post",
	path: "/api/projects/{projectId}/notifications/read",
	description: "Mark notifications as read",
	security: [{ bearerAuth: [] }],
	responses: {
		201: {
			description: "Notifications successfully marked as read",
		},
	},
});

// Express rotalarını tanımla
router.get("/", auth, developerAccess, getNotifications);
router.get("/unread", auth, developerAccess, getUnreadNotifications);
router.post("/read", auth, developerAccess, markAsRead);

export default router;
