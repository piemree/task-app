import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../handlers/async-error.handler";
import { getTaskLogsParamsSchema } from "../schemas/task-log.schema";
import { TaskLogService } from "../services/task-log.service";
import { validateObject } from "../utils/validate-request.util";

const taskLogService = new TaskLogService();

export const getTaskLogs = catchAsync(async (req: Request, res: Response) => {
	const validatedParams = validateObject(req.params, getTaskLogsParamsSchema);
	const taskLogs = await taskLogService.getTaskLogs({
		projectId: validatedParams.projectId,
		taskId: validatedParams.taskId,
		userId: req.user?._id || "",
	});
	res.status(StatusCodes.OK).json(taskLogs);
});
