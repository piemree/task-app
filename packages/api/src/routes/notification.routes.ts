import express, { type Router } from "express";

import { successResponseSchema } from "@schemas/helper.schema";
import { notificationListResponseSchema } from "@schemas/notification.schema";
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
	path: "/api/notifications",
	description: "Get new notifications",
	security: [{ bearerAuth: [] }],
	responses: {
		200: {
			description: "Notifications successfully retrieved",
			content: {
				"application/json": {
					schema: registry.register("NotificationListResponse", notificationListResponseSchema),
				},
			},
		},
	},
});

// get unread notifications count
registry.registerPath({
	tags: ["Notification"],
	method: "get",
	path: "/api/notifications/unread",
	description: "Get unread notifications",
	security: [{ bearerAuth: [] }],
	responses: {
		201: {
			description: "Unread notifications successfully retrieved",
			content: {
				"application/json": {
					schema: registry.register("NotificationListResponse", notificationListResponseSchema),
				},
			},
		},
	},
});

// mark as read
registry.registerPath({
	tags: ["Notification"],
	method: "post",
	path: "/api/notifications/read",
	description: "Mark notifications as read",
	security: [{ bearerAuth: [] }],
	responses: {
		201: {
			description: "Notifications successfully marked as read",
			content: {
				"application/json": {
					schema: registry.register("SuccessResponse", successResponseSchema),
				},
			},
		},
	},
});

// Express rotalarını tanımla
router.get("/", auth, getNotifications);
router.get("/unread", auth, getUnreadNotifications);
router.post("/read", auth, markAsRead);

export default router;
