import { AppError } from "../error/app-error";
import { errorMessages } from "../error/error-messages";
import { Project } from "../models/project.model";
import { TaskLog } from "../models/task-log.model";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import type { CreateTaskLogInput } from "../schemas/task-log.schema";

export class TaskLogService {
	async createTaskLog(args: { data: CreateTaskLogInput }) {
		const task = await Task.findById(args.data.task);
		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		const user = await User.findById(args.data.changedBy);
		if (!user) {
			throw new AppError(errorMessages.USER_NOT_FOUND, 404);
		}

		const taskLog = new TaskLog(args.data);

		await taskLog.save();

		// TaskLog modelini dönüş tipine uygun şekilde dönüştürmek için populate kullanıyoruz
		const populatedTaskLog = await TaskLog.findById(taskLog._id)
			.populate("task")
			.populate("changedBy")
			.populate("previousAssignee")
			.populate("newAssignee")
			.lean();

		return populatedTaskLog;
	}

	async getTaskLogs(args: { taskId: string; userId: string; projectId: string }) {
		const task = await Task.findById(args.taskId).populate("project");
		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		const user = await User.findById(args.userId);
		if (!user) {
			throw new AppError(errorMessages.USER_NOT_FOUND, 404);
		}

		const project = await Project.findById(args.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		return TaskLog.find({ task: args.taskId })
			.populate("changedBy")
			.populate("previousAssignee")
			.populate("newAssignee")
			.sort({ createdAt: -1 });
	}
}
