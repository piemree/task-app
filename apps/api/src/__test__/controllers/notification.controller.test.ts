import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import app from "../../app";
import type { LoginResponse } from "../../schemas/auth.schema";
import type { ProjectResponse } from "../../schemas/project.schema";
import { registerUserData } from "../data/user.data";
import { setupUser } from "../utils/auth.util";
import { createProject } from "../utils/project.util";
import { createTask } from "../utils/task.util";

describe("Notification Controller", () => {
	let loginData: LoginResponse;
	let project: ProjectResponse;

	beforeEach(async () => {
		loginData = await setupUser(registerUserData[0]);
		project = await createProject(loginData.token);
		await createTask(loginData.token, project._id, loginData.user._id);
	});

	it("GET /api/notifications should get all notifications", async () => {
		const response = await request(app).get("/api/notifications").set("Authorization", `Bearer ${loginData.token}`);

		expect(response.status).toBe(StatusCodes.OK);
		expect(Array.isArray(response.body)).toBe(true);
	});

	it("GET /api/notifications/unread should get unread notifications", async () => {
		const response = await request(app)
			.get("/api/notifications/unread")
			.set("Authorization", `Bearer ${loginData.token}`);

		expect(response.status).toBe(StatusCodes.OK);
		expect(Array.isArray(response.body)).toBe(true);
	});

	it("POST /api/notifications/read should mark notifications as read", async () => {
		const response = await request(app)
			.post("/api/notifications/read")
			.set("Authorization", `Bearer ${loginData.token}`);

		expect(response.status).toBe(StatusCodes.OK);
		expect(response.body).toHaveProperty("success");
	});
});
