import type { Request, Response } from "express";
import { catchAsync } from "../handlers/async-error.handler";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { AuthService } from "../services/auth.service";
import { validateObject } from "../utils/validate-request.util";

const authService = new AuthService();

export const register = catchAsync(async (req: Request, res: Response) => {
	const validatedRequest = validateObject(req.body, registerSchema);
	const result = await authService.register({ data: validatedRequest });
	res.status(201).json(result);
});

export const login = catchAsync(async (req: Request, res: Response) => {
	const validatedRequest = validateObject(req.body, loginSchema);
	const result = await authService.login({ data: validatedRequest });
	res.status(200).json(result);
});

export const getUserProfile = catchAsync(async (req: Request, res: Response) => {
	const result = await authService.getUserProfile({ userId: req.user?._id || "" });
	res.status(200).json(result);
});
