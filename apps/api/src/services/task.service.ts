import { StatusCodes } from "http-status-codes";
import { AppError } from "../error/app-error";
import { errorMessages } from "../error/error-messages";
import { type IProject, Project } from "../models/project.model";
import { Task } from "../models/task.model";
import { type IUser, User } from "../models/user.model";
import { logActionEnumSchema } from "../schemas/task-log.schema";
import type {
	TaskInput,
	TaskPriorityEnum,
	TaskResponse,
	TaskStatusEnum,
	UpdateTaskInput,
} from "../schemas/task.schema";
import { NotificationService } from "./notification.service";
import { TaskLogService } from "./task-log.service";

export class TaskService {
	private taskLogService: TaskLogService;
	private notificationService: NotificationService;

	constructor() {
		this.taskLogService = new TaskLogService();
		this.notificationService = new NotificationService();
	}

	private async findOneTask(args: { taskId?: string; projectId?: string }): Promise<TaskResponse> {
		const query = {};

		if (args.taskId) {
			Object.assign(query, { _id: args.taskId });
		}
		if (args.projectId) {
			Object.assign(query, { project: args.projectId });
		}

		const task = await Task.findOne(query)
			.populate<{ project: IProject }>({ path: "project" })
			.populate<{ createdBy: IUser }>({ path: "createdBy", select: "-password" })
			.populate<{ assignedTo: IUser }>({ path: "assignedTo", select: "-password" });

		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, StatusCodes.NOT_FOUND);
		}

		return task;
	}

	private async findManyTask(args: { projectId?: string }): Promise<TaskResponse[]> {
		const query = {};

		if (args.projectId) {
			Object.assign(query, { project: args.projectId });
		}

		const tasks = await Task.find(query)
			.populate<{ project: IProject }>({ path: "project" })
			.populate<{ createdBy: IUser }>({ path: "createdBy", select: "-password" })
			.populate<{ assignedTo: IUser }>({ path: "assignedTo", select: "-password" })
			.lean();

		return tasks;
	}

	async createTask(args: { data: TaskInput; projectId: string; userId: string }): Promise<TaskResponse> {
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
				task: task._id,
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

		this.taskLogService.createTaskLog({
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

		return this.findOneTask({ taskId: task._id.toString() });
	}

	async updateTask(args: {
		data: UpdateTaskInput;
		projectId: string;
		taskId: string;
		userId: string;
	}): Promise<TaskResponse> {
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
				createdAt: new Date(),
				updatedAt: new Date(),
			})),
		});

		this.notificationService.sendProjectNotification({
			data: {
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.updated,
			},
		});

		return this.findOneTask({ taskId: task._id.toString() });
	}

	async getTask(args: { taskId: string; projectId: string }): Promise<TaskResponse> {
		return this.findOneTask(args);
	}

	async getTasks(args: { projectId: string }): Promise<TaskResponse[]> {
		return this.findManyTask(args);
	}

	async deleteTask(args: { taskId: string; projectId: string }): Promise<{ success: boolean }> {
		const task = await Task.findOne({ _id: args.taskId, project: args.projectId });
		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		await task.deleteOne();

		return { success: true };
	}

	async updateTaskStatus(args: { taskId: string; projectId: string; userId: string; status: TaskStatusEnum }): Promise<{
		success: boolean;
	}> {
		const task = await Task.findOne({ _id: args.taskId, project: args.projectId });

		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		const project = await Project.findById(args.projectId);

		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const updatedTask = await Task.findByIdAndUpdate(task._id, { status: args.status }, { new: true });

		if (!updatedTask) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		this.taskLogService.createTaskLog({
			data: {
				task: task._id.toString(),
				action: logActionEnumSchema.enum.status_changed,
				previousStatus: task.status,
				newStatus: updatedTask.status,
				changedBy: args.userId,
				changes: {
					status: updatedTask.status,
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
				createdAt: new Date(),
				updatedAt: new Date(),
			})),
		});

		this.notificationService.sendProjectNotification({
			data: {
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.status_changed,
			},
		});

		return { success: true };
	}

	async changeAssignedUser(args: { taskId: string; projectId: string; userId: string; assignedTo: string }): Promise<{
		success: boolean;
	}> {
		const task = await Task.findOne({ _id: args.taskId, project: args.projectId });
		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}
		const project = await Project.findById(args.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const isUserInProject = await Project.findOne({
			_id: args.projectId,
			members: { $elemMatch: { user: args.assignedTo } },
		});
		if (!isUserInProject) {
			throw new AppError(errorMessages.USER_NOT_FOUND, 404);
		}

		await Task.findByIdAndUpdate(task._id, { assignedTo: args.assignedTo }, { new: true });

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
				createdAt: new Date(),
				updatedAt: new Date(),
			})),
		});

		this.notificationService.sendProjectNotification({
			data: {
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.assigned,
			},
		});

		return { success: true };
	}

	async changeTaskPriority(args: {
		taskId: string;
		projectId: string;
		userId: string;
		priority: TaskPriorityEnum;
	}): Promise<{ success: boolean }> {
		const task = await Task.findOne({ _id: args.taskId, project: args.projectId });
		if (!task) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		const project = await Project.findById(args.projectId);
		if (!project) {
			throw new AppError(errorMessages.PROJECT_NOT_FOUND, 404);
		}

		const updatedTask = await Task.findByIdAndUpdate(task._id, { priority: args.priority }, { new: true });
		if (!updatedTask) {
			throw new AppError(errorMessages.TASK_NOT_FOUND, 404);
		}

		this.taskLogService.createTaskLog({
			data: {
				task: task._id.toString(),
				action: logActionEnumSchema.enum.priority_changed,
				previousPriority: task.priority,
				newPriority: updatedTask.priority,
				changedBy: args.userId,
				changes: {
					priority: updatedTask.priority,
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
				createdAt: new Date(),
				updatedAt: new Date(),
			})),
		});

		this.notificationService.sendProjectNotification({
			data: {
				project: args.projectId,
				task: task._id.toString(),
				action: logActionEnumSchema.enum.priority_changed,
			},
		});
		return { success: true };
	}
}
