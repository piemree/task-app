import { Request, type Response } from "express";
import type { ZodError } from "zod";

export const handleZodError = (err: ZodError, res: Response) => {
	const formattedErrors = err.errors.map((error) => ({
		field: error.path.join("."),
		message: error.message,
		code: error.code,
	}));

	res.status(400).json({
		message: "Validation error",
		errors: formattedErrors,
	});
};
