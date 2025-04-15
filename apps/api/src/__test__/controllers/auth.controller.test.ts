import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../app";

const userData = {
	firstName: "John",
	lastName: "Doe",
	email: "john@example.com",
	password: "password",
};

describe("Auth Controller", () => {
	it("POST /api/auth/register should create a new user", async () => {
		const response = await request(app).post("/api/auth/register").send(userData);
		expect(response.status).toBe(StatusCodes.CREATED);
	});
});
