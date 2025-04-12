import type { NextFunction, Request, Response } from "express";
import { AppError } from "../error/app-error";
import { errorMessages } from "../error/error-messages";
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
	next(new AppError(errorMessages.ROUTE_NOT_FOUND, 404));
};
