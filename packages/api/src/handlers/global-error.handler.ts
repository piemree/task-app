import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../error/app-error";
import { errorMessages } from "../error/error-messages";
import { handlePrismaError } from "./prisma-error.handler";
import { handleZodError } from "./zod-error.handler";

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	// Zod validasyon hatası kontrolü
	if (err instanceof ZodError) {
		handleZodError(err, res);
		return;
	}

	// Prisma hatalarını yakala
	if (err instanceof PrismaClientKnownRequestError || err instanceof PrismaClientValidationError) {
		handlePrismaError(err, res);
		return;
	}

	const statusCode = err instanceof AppError ? err.statusCode : 500;
	const message = err.message || errorMessages.INTERNAL_SERVER_ERROR;

	res.status(statusCode).json({
		message,
		error: err instanceof Error ? err.message : errorMessages.INTERNAL_SERVER_ERROR,
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
};
