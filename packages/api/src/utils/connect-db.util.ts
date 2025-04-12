import mongoose from "mongoose";
import config from "../config/config";
export const connectDB = async () => {
	try {
		await mongoose.connect(config.databaseUrl);
		console.log("MongoDB connected successfully");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};
