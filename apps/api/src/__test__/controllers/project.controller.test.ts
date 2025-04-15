import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../app";
import type { LoginResponse } from "../../schemas/auth.schema";
import type { ProjectResponse } from "../../schemas/project.schema";
import { createProjectData, inviteUserData, updateProjectData } from "../data/project.data";
import { registerUserData } from "../data/user.data";
import { setupUser } from "../utils/auth.util";
import { acceptInvite, createProject, sendInvite } from "../utils/project.util";
import { TEST_DB_URL } from "../vitest.setup";

describe("Project Controller", () => {
	let loginData: LoginResponse;

	beforeEach(async () => {
		loginData = await setupUser(registerUserData[0]);
	});

	it("POST /api/projects should create a new project", async () => {
		try {
			const response = await request(app)
				.post("/api/projects")
				.set("Authorization", `Bearer ${loginData.token}`)
				.send(createProjectData[0]);

			expect(response.status).toBe(StatusCodes.CREATED);
			expect(response.body).toHaveProperty("_id");
			expect(response.body.name).toBe(createProjectData[0].name);
		} catch (error) {
			console.error("Test error:", error);
			throw error;
		}
	});

	it("GET /api/projects should get all projects", async () => {
		try {
			await createProject(loginData.token);

			const response = await request(app).get("/api/projects").set("Authorization", `Bearer ${loginData.token}`);

			expect(response.status).toBe(StatusCodes.OK);
			expect(Array.isArray(response.body)).toBe(true);
		} catch (error) {
			console.error("Test error:", error);
			throw error;
		}
	});

	it("GET /api/projects/:projectId should get a project", async () => {
		const project = await createProject(loginData.token);

		const response = await request(app)
			.get(`/api/projects/${project._id}`)
			.set("Authorization", `Bearer ${loginData.token}`);

		expect(response.status).toBe(StatusCodes.OK);
		expect(response.body).toHaveProperty("_id");
		expect(response.body._id).toBe(project._id);
	});

	it("PUT /api/projects/:projectId should update a project", async () => {
		const project = await createProject(loginData.token);

		const response = await request(app)
			.put(`/api/projects/${project._id}`)
			.set("Authorization", `Bearer ${loginData.token}`)
			.send(updateProjectData[0]);

		expect(response.status).toBe(StatusCodes.OK);
		expect(response.body).toHaveProperty("name");
		expect(response.body.name).toBe(updateProjectData[0].name);
	});

	it("POST /api/projects/:projectId/invite should invite a user", async () => {
		const project = await createProject(loginData.token);

		const response = await request(app)
			.post(`/api/projects/${project._id}/invite`)
			.set("Authorization", `Bearer ${loginData.token}`)
			.send(inviteUserData[0]);

		expect(response.status).toBe(StatusCodes.OK);
		expect(response.body).toHaveProperty("inviteToken");
	});

	it("POST /api/projects/accept-invite should accept an invitation", async () => {
		const secondUserLoginData = await setupUser(registerUserData[1]);

		const project = await createProject(loginData.token);
		const inviteToken = await sendInvite(loginData.token, project._id, registerUserData[1].email, "admin");

		const response = await request(app)
			.post("/api/projects/accept-invite")
			.set("Authorization", `Bearer ${secondUserLoginData.token}`)
			.send({ inviteToken });

		expect(response.status).toBe(StatusCodes.OK);
		expect(response.body).toHaveProperty("success");
		expect(response.body.success).toBe(true);
	});

	it("DELETE /api/projects/:projectId/members/:userId should remove a member", async () => {
		const secondUserLoginData = await setupUser(registerUserData[1]);

		const project = await createProject(loginData.token);

		const inviteToken = await sendInvite(loginData.token, project._id, registerUserData[1].email, "admin");
		await acceptInvite(secondUserLoginData.token, inviteToken);

		const updatedProjectResponse = await request(app)
			.get(`/api/projects/${project._id}`)
			.set("Authorization", `Bearer ${loginData.token}`);

		const updatedProject = updatedProjectResponse.body as ProjectResponse;

		const memberId = updatedProject.members.find((m) => m.user._id !== loginData.user._id)?.user._id;

		const response = await request(app)
			.delete(`/api/projects/${project._id}/members/${memberId}`)
			.set("Authorization", `Bearer ${loginData.token}`);

		expect(response.status).toBe(StatusCodes.OK);
	});

	it("DELETE /api/projects/:projectId should delete a project", async () => {
		const project = await createProject(loginData.token);

		const response = await request(app)
			.delete(`/api/projects/${project._id}`)
			.set("Authorization", `Bearer ${loginData.token}`);

		expect(response.status).toBe(StatusCodes.OK);

		const getResponse = await request(app)
			.get(`/api/projects/${project._id}`)
			.set("Authorization", `Bearer ${loginData.token}`);

		expect(getResponse.status).toBe(StatusCodes.NOT_FOUND);
	});
});
