import path from "node:path";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import PrettyError from "pretty-error";
import swaggerUi from "swagger-ui-express";
import config from "./config/config";

import { globalErrorHandler } from "./handlers/global-error.handler";
// Routes
import { notFoundHandler } from "./handlers/not-found.handler";
import { openApiDocument, registry } from "./openapi";
import routes from "./routes";
// Load environment variables
dotenv.config();

// Configure PrettyError
const prettyError = new PrettyError();
prettyError.skipNodeFiles();
prettyError.skipPackage("express");

// Override default error handler
Error.stackTraceLimit = Number.POSITIVE_INFINITY;
Error.prepareStackTrace = (err, stack) => {
	return prettyError.render(err);
};

// MongoDB Bağlantısı
mongoose
	.connect(config.databaseUrl)
	.then(() => {
		console.log("MongoDB connected successfully");
	})
	.catch((error) => {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	});

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Statik dosyalar için public dizinini kullan
app.use(express.static(path.join(__dirname, "../public")));

// Import routes
app.use("/api", routes);

// Generate OpenAPI document
const generator = new OpenApiGeneratorV3(registry.definitions);
const document = generator.generateDocument(openApiDocument);

// Swagger UI'ı kur
app.use(
	"/docs",
	swaggerUi.serve,
	swaggerUi.setup(document, {
		customJs: ["/swagger/swagger-ui.js"],
	}),
);

// 404 - Not Found Middleware
app.use(notFoundHandler);

// Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;
