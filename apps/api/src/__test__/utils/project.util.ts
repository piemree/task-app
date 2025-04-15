import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../../app";
import type { ProjectResponse, ProjectRole } from "../../schemas/project.schema";
import { createProjectData } from "../data/project.data";

export const createProject = async (token: string) => {
	try {
		const response = await request(app)
			.post("/api/projects")
			.set("Authorization", `Bearer ${token}`)
			.send(createProjectData[0]);

		if (response.status !== StatusCodes.CREATED) {
			throw new Error(`Proje oluşturma başarısız: ${JSON.stringify(response.body)}`);
		}

		return response.body as ProjectResponse;
	} catch (error) {
		console.error("Create project error:", error);
		throw error;
	}
};

export const sendInvite = async (token: string, projectId: string, email: string, role: ProjectRole) => {
	try {
		const response = await request(app)
			.post(`/api/projects/${projectId}/invite`)
			.set("Authorization", `Bearer ${token}`)
			.send({ email, role });

		if (response.status !== StatusCodes.OK) {
			throw new Error(`Davet gönderimi başarısız: ${JSON.stringify(response.body)}`);
		}

		return response.body.inviteToken as string;
	} catch (error) {
		console.error("Send invite error:", error);
		throw error;
	}
};

export const acceptInvite = async (token: string, inviteToken: string) => {
	try {
		const response = await request(app)
			.post("/api/projects/accept-invite")
			.set("Authorization", `Bearer ${token}`)
			.send({ inviteToken });

		if (response.status !== StatusCodes.OK) {
			throw new Error(`Davet kabul işlemi başarısız: ${JSON.stringify(response.body)}`);
		}

		return response.body as { success: boolean };
	} catch (error) {
		console.error("Accept invite error:", error);
		throw error;
	}
};
