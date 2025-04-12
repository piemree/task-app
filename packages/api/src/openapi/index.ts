import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import config from "../config/config";

export const registry = new OpenAPIRegistry();

// Bearer Authentication şemasını tanımla
registry.registerComponent("securitySchemes", "bearerAuth", {
	type: "http",
	scheme: "bearer",
	bearerFormat: "JWT",
	description: "JWT token with Bearer Authentication",
});

export const openApiDocument = {
	openapi: "3.0.0",
	info: {
		title: "Task API",
		version: "1.0.0",
		description: "Task API",
	},
	servers: [{ url: `http://localhost:${config.port}` }],
};
