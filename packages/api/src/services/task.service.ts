import { AppError } from "../error/app-error";
import { errorMessages } from "../error/error-messages";
import { Project } from "../models/project.model";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import { logActionEnumSchema } from "../schemas/task-log.schema";
import type { CreateTaskInput, TaskPriorityEnum, TaskStatusEnum, UpdateTaskInput } from "../schemas/task.schema";
import { NotificationService } from "./notification.service";
import { TaskLogService } from "./task-log.service";

export class TaskService {
	private taskLogService: TaskLogService;
	private notificationService: NotificationService;

	constructor() {
		this.taskLogService = new TaskLogService();
		this.notificationService = new NotificationService();
	}

	async createTask(args: { data: CreateTaskInput; projectId: string; userId: string }) {
		const assignedUser = await User.findById(args.data.assignedTo);
		if (!assignedUser) {
			throw new AppError(errorMessages.USER_NOT_FOUND, 404);
		}

		const project = await Project.findById(args.projectId);

		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const task = await Task.create({
			...args.data,
			project: args.projectId,
			createdBy: args.userId,
		});

		this.notificationService.createBulkNotification({
			data: project.members.map((member) => ({
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.created,
				user: member.user.toString(),
				isRead: false,
			})),
		});

		this.notificationService.sendProjectNotification({
			data: {
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.created,
			},
		});

		// Log kaydı oluştur
		await this.taskLogService.createTaskLog({
			data: {
				task: task._id.toString(),
				action: logActionEnumSchema.enum.created,
				previousStatus: undefined,
				newStatus: task.status,
				previousPriority: undefined,
				newPriority: task.priority,
				previousAssignee: undefined,
				newAssignee: task.assignedTo,
				changedBy: args.userId,
				changes: {
					title: task.title,
					description: task.description,
					status: task.status,
					priority: task.priority,
					assignedTo: task.assignedTo,
				},
			},
		});

		return task;
	}

	async updateTask(args: { data: UpdateTaskInput; projectId: string; taskId: string; userId: string }) {
		const task = await Task.findOne({ _id: args.taskId, project: args.projectId });
		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		const project = await Project.findById(args.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const updatedTask = await Task.findByIdAndUpdate(
			task._id,
			{
				title: args.data.title,
				description: args.data.description,
			},
			{ new: true },
		);

		this.taskLogService.createTaskLog({
			data: {
				task: task._id.toString(),
				action: logActionEnumSchema.enum.updated,
				changes: {
					title: updatedTask?.title,
					description: updatedTask?.description,
				},
				changedBy: args.userId,
			},
		});

		this.notificationService.createBulkNotification({
			data: project.members.map((member) => ({
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.updated,
				user: member.user.toString(),
				isRead: false,
			})),
		});

		this.notificationService.sendProjectNotification({
			data: {
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.updated,
			},
		});

		return updatedTask;
	}

	async getTask(args: { taskId: string; projectId: string }) {
		const task = await Task.findOne({ _id: args.taskId, project: args.projectId });
		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		return task;
	}

	async getTasks(args: { projectId: string }) {
		const project = await Project.findById(args.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const tasks = await Task.find({ project: args.projectId }).populate("assignedTo createdBy");

		return tasks;
	}

	async deleteTask(args: { taskId: string; projectId: string }) {
		const task = await Task.findOne({ _id: args.taskId, project: args.projectId });
		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		await task.deleteOne();

		return { success: true };
	}

	async updateTaskStatus(args: { taskId: string; projectId: string; userId: string; status: TaskStatusEnum }) {
		const task = await Task.findOne({ _id: args.taskId, project: args.projectId });
		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		const project = await Project.findById(args.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const updatedTask = await Task.findByIdAndUpdate(task._id, { status: args.status }, { new: true });

		this.taskLogService.createTaskLog({
			data: {
				task: task._id.toString(),
				action: logActionEnumSchema.enum.status_changed,
				previousStatus: task.status,
				newStatus: args.status,
				changedBy: args.userId,
				changes: {
					status: args.status,
				},
			},
		});

		this.notificationService.createBulkNotification({
			data: project.members.map((member) => ({
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.status_changed,
				user: member.user.toString(),
				isRead: false,
			})),
		});

		this.notificationService.sendProjectNotification({
			data: {
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.status_changed,
			},
		});

		return updatedTask;
	}

	async changeAssignedUser(args: { taskId: string; projectId: string; userId: string; assignedTo: string }) {
		const task = await Task.findOne({ _id: args.taskId, project: args.projectId });
		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		const project = await Project.findById(args.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const isUserInProject = await Project.findOne({ _id: args.projectId, members: args.userId });
		if (!isUserInProject) {
			throw new AppError(errorMessages.USER_NOT_FOUND, 404);
		}

		const updatedTask = await Task.findByIdAndUpdate(task._id, { assignedTo: args.assignedTo }, { new: true });

		this.taskLogService.createTaskLog({
			data: {
				task: task._id.toString(),
				action: logActionEnumSchema.enum.assigned,
				previousAssignee: task.assignedTo.toString(),
				newAssignee: args.assignedTo,
				changedBy: args.userId,
				changes: {
					assignedTo: args.assignedTo,
				},
			},
		});

		this.notificationService.createBulkNotification({
			data: project.members.map((member) => ({
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.assigned,
				user: member.user.toString(),
				isRead: false,
			})),
		});

		this.notificationService.sendProjectNotification({
			data: {
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.assigned,
			},
		});

		return updatedTask;
	}

	async changeTaskPriority(args: { taskId: string; projectId: string; userId: string; priority: TaskPriorityEnum }) {
		const task = await Task.findOne({ _id: args.taskId, project: args.projectId });
		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		const project = await Project.findById(args.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const updatedTask = await Task.findByIdAndUpdate(task._id, { priority: args.priority }, { new: true });

		this.taskLogService.createTaskLog({
			data: {
				task: task._id.toString(),
				action: logActionEnumSchema.enum.priority_changed,
				previousPriority: task.priority,
				newPriority: args.priority,
				changedBy: args.userId,
				changes: {
					priority: args.priority,
				},
			},
		});

		this.notificationService.createBulkNotification({
			data: project.members.map((member) => ({
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.priority_changed,
				user: member.user.toString(),
				isRead: false,
			})),
		});

		this.notificationService.sendProjectNotification({
			data: {
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.priority_changed,
			},
		});
		return updatedTask;
	}
}
