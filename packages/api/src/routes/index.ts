import express, { type Router } from "express";
import authRoutes from "./auth.routes";
import notificationRoutes from "./notification.routes";
import projectRoutes from "./project.routes";
import taskLogRoutes from "./task-log.routes";
import taskRoutes from "./task.routes";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/projects/:projectId/tasks", taskRoutes);
router.use("/projects/:projectId/tasks/:taskId/logs", taskLogRoutes);
router.use("/notifications", notificationRoutes);
export default router;
