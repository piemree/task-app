import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../error/app-error";
import { errorMessages } from "../error/error-messages";
import { catchAsync } from "../handlers/async-error.handler";
import { type ProjectRole, projectIdSchema, userProjectRoleSchema } from "../schemas/project.schema";
import { ProjectService } from "../services/project.service";
import { validateObject } from "../utils/validate-request.util";

export const protectProject = (roles?: ProjectRole[]) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		// Kullanıcı bilgisini kontrol et (protect middleware'inden gelmiş olmalı)
		if (!req.user) {
			throw new AppError(errorMessages.AUTH_USER_NOT_FOUND, StatusCodes.UNAUTHORIZED);
		}

		const { projectId } = validateObject(req.params, projectIdSchema);

		const memberRole = await ProjectService.checkProjectAccessByRole({
			projectId,
			userId: req.user._id,
			roles,
		});

		if (!memberRole) {
			throw new AppError(errorMessages.AUTH_INSUFFICIENT_PERMISSIONS, StatusCodes.FORBIDDEN);
		}

		req.user.projectRole = memberRole;

		next();
	});
};

export const adminAccess = protectProject([userProjectRoleSchema.enum.admin]);
export const managerAccess = protectProject([userProjectRoleSchema.enum.admin, userProjectRoleSchema.enum.manager]);
export const developerAccess = protectProject([
	userProjectRoleSchema.enum.admin,
	userProjectRoleSchema.enum.manager,
	userProjectRoleSchema.enum.developer,
]);
