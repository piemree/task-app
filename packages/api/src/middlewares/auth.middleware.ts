import type { NextFunction, Request, Response } from "express";
import { AppError } from "../error/app-error";
import { errorMessages } from "../error/error-messages";
import { catchAsync } from "../handlers/async-error.handler";
import { TokenService } from "../services/token.service";

const tokenService = new TokenService();
// JWT token'ı ile kullanıcı doğrulama
export const auth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	let token: string | undefined;

	if (req.headers.authorization?.startsWith("Bearer")) {
		// Token'ı ayıkla
		token = req.headers.authorization?.split(" ")[1];

		// Token'ı doğrula
		const decoded = tokenService.verifyAuthToken(token);

		req.user = decoded;
		next();
	}

	if (!token) {
		throw new AppError(errorMessages.AUTH_TOKEN_MISSING, 401);
	}
});
