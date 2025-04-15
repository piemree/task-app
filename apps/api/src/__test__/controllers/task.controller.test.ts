import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import app from "../../app";
import type { LoginResponse } from "../../schemas/auth.schema";
import type { ProjectResponse } from "../../schemas/project.schema";
import { createTaskData, taskPriorityData, taskStatusData, updateTaskData } from "../data/task.data";
import { registerUserData } from "../data/user.data";
import { setupUser } from "../utils/auth.util";
import { createProject } from "../utils/project.util";
import { createTask } from "../utils/task.util";

describe("Task Controller", () => {
	let loginData: LoginResponse;
	let project: ProjectResponse;

	beforeEach(async () => {
		loginData = await setupUser(registerUserData[0]);
		project = await createProject(loginData.token);
	});

	it("POST /api/projects/:projectId/tasks should create a new task", async () => {
		const response = await request(app)
			.post(`/api/projects/${project._id}/tasks`)
			.set("Authorization", `Bearer ${loginData.token}`)
			.send({ ...createTaskData[0], assignedTo: loginData.user._id });

		expect(response.status).toBe(StatusCodes.CREATED);
	});

	it("GET /api/projects/:projectId/tasks should get all tasks", async () => {
		await createTask(loginData.token, project._id, loginData.user._id);

		const response = await request(app)
			.get(`/api/projects/${project._id}/tasks`)
			.set("Authorization", `Bearer ${loginData.token}`);

		expect(response.status).toBe(StatusCodes.OK);
	});

	it("GET /api/projects/:projectId/tasks/:taskId should get a task", async () => {
		const task = await createTask(loginData.token, project._id, loginData.user._id);

		const response = await request(app)
			.get(`/api/projects/${project._id}/tasks/${task._id}`)
			.set("Authorization", `Bearer ${loginData.token}`);

		expect(response.status).toBe(StatusCodes.OK);
	});

	it("PUT /api/projects/:projectId/tasks/:taskId should update a task", async () => {
		const task = await createTask(loginData.token, project._id, loginData.user._id);

		const response = await request(app)
			.put(`/api/projects/${project._id}/tasks/${task._id}`)
			.set("Authorization", `Bearer ${loginData.token}`)
			.send(updateTaskData[0]);

		expect(response.status).toBe(StatusCodes.OK);
	});

	it("PUT /api/projects/:projectId/tasks/:taskId/status should change task status", async () => {
		const task = await createTask(loginData.token, project._id, loginData.user._id);

		const response = await request(app)
			.put(`/api/projects/${project._id}/tasks/${task._id}/status`)
			.set("Authorization", `Bearer ${loginData.token}`)
			.send({ status: taskStatusData[1] });

		expect(response.status).toBe(StatusCodes.OK);
	});
});
