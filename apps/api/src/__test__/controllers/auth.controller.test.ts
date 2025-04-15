import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "../../app";
import type { LoginResponse } from "../../schemas/auth.schema";
import { registerUserData, updateProfileData } from "../data/user.data";
import { setupUser } from "../utils/auth.util";
import { TEST_DB_URL } from "../vitest.setup";

describe("Auth Controller", () => {
	it("POST /api/auth/register should create a new user", async () => {
		const response = await request(app).post("/api/auth/register").send(registerUserData[0]);
		expect(response.status).toBe(StatusCodes.CREATED);
		expect(response.body).toHaveProperty("_id");
		expect(response.body.email).toBe(registerUserData[0].email);
	});

	it("POST /api/auth/login should authenticate a user", async () => {
		await setupUser(registerUserData[1]);
		const response = await request(app).post("/api/auth/login").send({
			email: registerUserData[1].email,
			password: registerUserData[1].password,
		});

		expect(response.status).toBe(StatusCodes.OK);
		expect(response.body).toHaveProperty("token");
		expect(response.body).toHaveProperty("user");
	});

	it("GET /api/auth/profile should get user profile", async () => {
		const loginData: LoginResponse = await setupUser(registerUserData[2]);

		const response = await request(app).get("/api/auth/profile").set("Authorization", `Bearer ${loginData.token}`);

		expect(response.status).toBe(StatusCodes.OK);
		expect(response.body).toHaveProperty("_id");
		expect(response.body._id).toBe(loginData.user._id);
	});

	it("PUT /api/auth/profile should update user profile", async () => {
		const loginData: LoginResponse = await setupUser(registerUserData[1]);

		const response = await request(app)
			.put("/api/auth/profile")
			.set("Authorization", `Bearer ${loginData.token}`)
			.send(updateProfileData[0]);

		expect(response.status).toBe(StatusCodes.OK);
	});
});
