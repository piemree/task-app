import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../handlers/async-error.handler";
import { userIdSchema } from "../schemas/auth.schema";
import { projectIdSchema } from "../schemas/project.schema";
import {
	projectIdAndTaskIdSchema,
	taskInputSchema,
	taskPrioritySchema,
	taskStatusSchema,
	updateTaskSchema,
} from "../schemas/task.schema";
import { TaskService } from "../services/task.service";
import { validateObject } from "../utils/validate-request.util";

const taskService = new TaskService();

export const createTask = catchAsync(async (req: Request, res: Response) => {
	const validatedRequest = validateObject(req.body, taskInputSchema);
	const validatedParams = validateObject(req.params, projectIdSchema);
	const result = await taskService.createTask({
		data: validatedRequest,
		projectId: validatedParams.projectId,
		userId: req.user?._id || "",
	});
	res.status(StatusCodes.CREATED).json(result);
});

export const updateTask = catchAsync(async (req: Request, res: Response) => {
	const validatedRequest = validateObject(req.body, updateTaskSchema);
	const validatedParams = validateObject(req.params, projectIdAndTaskIdSchema);
	const result = await taskService.updateTask({
		data: validatedRequest,
		projectId: validatedParams.projectId,
		taskId: validatedParams.taskId,
		userId: req.user?._id || "",
	});
	res.status(StatusCodes.OK).json(result);
});

export const getTask = catchAsync(async (req: Request, res: Response) => {
	const validatedParams = validateObject(req.params, projectIdAndTaskIdSchema);
	const result = await taskService.getTask({
		projectId: validatedParams.projectId,
		taskId: validatedParams.taskId,
	});
	res.status(StatusCodes.OK).json(result);
});

export const getTasks = catchAsync(async (req: Request, res: Response) => {
	const validatedParams = validateObject(req.params, projectIdSchema);
	const result = await taskService.getTasks({
		projectId: validatedParams.projectId,
	});
	res.status(StatusCodes.OK).json(result);
});

export const changeTaskStatus = catchAsync(async (req: Request, res: Response) => {
	const validatedParams = validateObject(req.params, projectIdAndTaskIdSchema);
	const validatedRequest = validateObject(req.body, taskStatusSchema);
	const result = await taskService.updateTaskStatus({
		taskId: validatedParams.taskId,
		projectId: validatedParams.projectId,
		userId: req.user?._id || "",
		status: validatedRequest.status,
	});
	res.status(StatusCodes.OK).json(result);
});

export const changeAssignedUser = catchAsync(async (req: Request, res: Response) => {
	const validatedParams = validateObject(req.params, projectIdAndTaskIdSchema);
	const validatedRequest = validateObject(req.body, userIdSchema);

	const result = await taskService.changeAssignedUser({
		taskId: validatedParams.taskId,
		projectId: validatedParams.projectId,
		userId: req.user?._id || "",
		assignedTo: validatedRequest.userId,
	});
	res.status(StatusCodes.OK).json(result);
});

export const changeTaskPriority = catchAsync(async (req: Request, res: Response) => {
	const validatedParams = validateObject(req.params, projectIdAndTaskIdSchema);
	const validatedRequest = validateObject(req.body, taskPrioritySchema);
	const result = await taskService.changeTaskPriority({
		taskId: validatedParams.taskId,
		projectId: validatedParams.projectId,
		userId: req.user?._id || "",
		priority: validatedRequest.priority,
	});
	res.status(StatusCodes.OK).json(result);
});

export const deleteTask = catchAsync(async (req: Request, res: Response) => {
	const validatedParams = validateObject(req.params, projectIdAndTaskIdSchema);
	const result = await taskService.deleteTask({
		taskId: validatedParams.taskId,
		projectId: validatedParams.projectId,
	});
	res.status(StatusCodes.OK).json(result);
});
