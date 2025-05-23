import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../handlers/async-error.handler";
import {
	inviteTokenSchema,
	inviteUserSchema,
	projectIdSchema,
	projectInputSchema,
	removeMemberSchema,
	updateProjectSchema,
} from "../schemas/project.schema";
import { ProjectService } from "../services/project.service";
import { validateObject } from "../utils/validate-request.util";

const projectService = new ProjectService();

export const createProject = catchAsync(async (req: Request, res: Response) => {
	const validatedRequest = validateObject(req.body, projectInputSchema);
	const result = await projectService.createProject({
		data: validatedRequest,
		userId: req.user?._id || "",
	});
	res.status(StatusCodes.CREATED).json(result);
});

export const updateProject = catchAsync(async (req: Request, res: Response) => {
	const validatedRequest = validateObject(req.body, updateProjectSchema);
	const validatedParams = validateObject(req.params, projectIdSchema);
	const result = await projectService.updateProject({
		data: validatedRequest,
		projectId: validatedParams.projectId,
		userId: req.user?._id || "",
	});
	res.status(200).json(result);
});

export const getProject = catchAsync(async (req: Request, res: Response) => {
	const validatedParams = validateObject(req.params, projectIdSchema);
	const result = await projectService.getProject({
		projectId: validatedParams.projectId,
		userId: req.user?._id || "",
	});
	res.status(StatusCodes.OK).json(result);
});

export const getProjects = catchAsync(async (req: Request, res: Response) => {
	const result = await projectService.getProjects(req.user?._id || "");
	res.status(StatusCodes.OK).json(result);
});

export const inviteUser = catchAsync(async (req: Request, res: Response) => {
	const validatedRequest = validateObject(req.body, inviteUserSchema);
	const validatedParams = validateObject(req.params, projectIdSchema);
	const result = await projectService.sendInvite({
		projectId: validatedParams.projectId,
		email: validatedRequest.email,
		role: validatedRequest.role,
	});
	res.status(StatusCodes.OK).json(result);
});

export const acceptInvite = catchAsync(async (req: Request, res: Response) => {
	const validatedRequest = validateObject(req.body, inviteTokenSchema);
	const result = await projectService.acceptInvite(validatedRequest.inviteToken);
	res.status(StatusCodes.OK).json(result);
});

export const removeMember = catchAsync(async (req: Request, res: Response) => {
	const validatedParams = validateObject(req.params, removeMemberSchema);
	const result = await projectService.removeMember({
		projectId: validatedParams.projectId,
		userId: validatedParams.userId,
	});
	res.status(StatusCodes.OK).json(result);
});

export const deleteProject = catchAsync(async (req: Request, res: Response) => {
	const validatedParams = validateObject(req.params, projectIdSchema);
	const result = await projectService.deleteProject(validatedParams.projectId);
	res.status(StatusCodes.OK).json(result);
});
