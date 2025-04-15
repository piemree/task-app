import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { afterAll, afterEach, beforeAll } from "vitest";
export const TEST_DB_URL = "mongodb://localhost:27017/task-app-test";

process.env.NODE_ENV = "test";

const uniqueDbUrl = `${TEST_DB_URL}-${uuidv4()}`;

beforeAll(async () => {
	try {
		await mongoose.connect(uniqueDbUrl, {
			serverSelectionTimeoutMS: 5000,
		});
	} catch (error) {
		console.error("MongoDB connection error:", error);
		throw error;
	}
});

afterEach(async () => {
	if (mongoose.connection.readyState === 1) {
		try {
			if (mongoose.connection.db) {
				await mongoose.connection.db.dropDatabase();
			}
		} catch (err) {
			console.error("Error dropping database after test:", err);
		}
	}
});

afterAll(async () => {
	try {
		if (mongoose.connection.readyState !== 0) {
			await mongoose.connection.close(true);
		}
	} catch (error) {
		console.error("Global teardown error:", error);
	}
});
