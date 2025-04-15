import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../app";
import type { LoginResponse } from "../../schemas/auth.schema";
import type { ProjectResponse } from "../../schemas/project.schema";
import type { TaskResponse } from "../../schemas/task.schema";
import { registerUserData } from "../data/user.data";
import { setupUser } from "../utils/auth.util";
import { createProject } from "../utils/project.util";
import { createTask, updateTaskStatus } from "../utils/task.util";
import { TEST_DB_URL } from "../vitest.setup";

describe("Task Logs Controller", () => {
	let loginData: LoginResponse;
	let project: ProjectResponse;
	let task: TaskResponse;

	beforeEach(async () => {
		loginData = await setupUser(registerUserData[0]);
		project = await createProject(loginData.token);
		task = await createTask(loginData.token, project._id, loginData.user._id);
		await updateTaskStatus(loginData.token, project._id, task._id, "pending");
	});

	it("GET /api/projects/:projectId/tasks/:taskId/logs should get task logs", async () => {
		const response = await request(app)
			.get(`/api/projects/${project._id}/tasks/${task._id}/logs`)
			.set("Authorization", `Bearer ${loginData.token}`);

		expect(response.status).toBe(StatusCodes.OK);
	});
});
