import { resolve } from "node:path";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach } from "vitest";

dotenv.config({ path: resolve(__dirname, ".env.test") });

const TEST_DB_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/task-app-test";

beforeAll(async () => {
	try {
		await mongoose.connect(TEST_DB_URL);
		console.log("Database connected successfully");
	} catch (error) {
		console.error("Database connection error:", error);
		process.exit(1);
	}
});

beforeEach(async () => {
	if (mongoose.connection.readyState === 1) {
		const collections = mongoose.connection.collections;

		for (const key in collections) {
			const collection = collections[key];
			await collection.deleteMany({});
		}
		console.log("Database collections cleaned");
	}
});

afterAll(async () => {
	if (mongoose.connection.readyState === 1) {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
		console.log("Database connection closed");
	}
});
