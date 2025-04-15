import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../../app";
import type { TaskResponse, TaskStatusEnum } from "../../schemas/task.schema";
import { createTaskData } from "../data/task.data";

export const createTask = async (token: string, projectId: string, assignedTo: string) => {
	try {
		const response = await request(app)
			.post(`/api/projects/${projectId}/tasks`)
			.set("Authorization", `Bearer ${token}`)
			.send({ ...createTaskData[0], assignedTo });

		if (response.status !== 201) {
			throw new Error(`Görev oluşturma başarısız: ${JSON.stringify(response.body)}`);
		}

		return response.body as TaskResponse;
	} catch (error) {
		console.error("Create task error:", error);
		throw error;
	}
};

export const updateTaskStatus = async (token: string, projectId: string, taskId: string, status: TaskStatusEnum) => {
	try {
		///api/projects/{projectId}/tasks/{taskId}/status
		const response = await request(app)
			.put(`/api/projects/${projectId}/tasks/${taskId}/status`)
			.set("Authorization", `Bearer ${token}`)
			.send({ status });

		if (response.status !== StatusCodes.OK) {
			throw new Error(`Görev durumu güncelleme başarısız: ${JSON.stringify(response.body)}`);
		}

		return response.body as { success: boolean };
	} catch (error) {
		console.error("Update task status error:", error);
		throw error;
	}
};
