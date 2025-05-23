import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../handlers/async-error.handler";
import { loginInputSchema, registerInputSchema, updateUserProfileInputSchema } from "../schemas/auth.schema";
import { AuthService } from "../services/auth.service";
import { validateObject } from "../utils/validate-request.util";

const authService = new AuthService();

export const register = catchAsync(async (req: Request, res: Response) => {
	const validatedRequest = validateObject(req.body, registerInputSchema);
	const result = await authService.register({ data: validatedRequest });
	res.status(StatusCodes.CREATED).json(result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
	const validatedRequest = validateObject(req.body, loginInputSchema);
	const result = await authService.login({ data: validatedRequest });
	res.status(StatusCodes.OK).json(result);
});

export const getUserProfile = catchAsync(async (req: Request, res: Response) => {
	const result = await authService.getUserProfile({ userId: req.user?._id || "" });
	res.status(StatusCodes.OK).json(result);
});

export const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
	const validatedRequest = validateObject(req.body, updateUserProfileInputSchema);
	const result = await authService.updateUserProfile({
		userId: req.user?._id || "",
		data: validatedRequest,
	});
	res.status(StatusCodes.OK).json(result);
});
