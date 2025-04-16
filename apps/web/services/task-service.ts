import type { TaskLogResponse } from "@schemas/task-log.schema";
import type { TaskInput, TaskPriorityEnum, TaskResponse, TaskStatusEnum, UpdateTaskInput } from "@schemas/task.schema";
import { api } from "../lib/api";

export const taskService = {
	createTask: async (projectId: string, data: TaskInput) => {
		const response = await api.post<TaskResponse>(`/projects/${projectId}/tasks`, data);
		return response;
	},

	getTasks: async (projectId: string) => {
		const response = await api.get<TaskResponse[]>(`/projects/${projectId}/tasks`);
		return response;
	},

	getTask: async (projectId: string, taskId: string) => {
		const response = await api.get<TaskResponse>(`/projects/${projectId}/tasks/${taskId}`);
		return response;
	},

	updateTask: async (projectId: string, taskId: string, data: UpdateTaskInput) => {
		const response = await api.put<TaskResponse>(`/projects/${projectId}/tasks/${taskId}`, data);
		return response;
	},

	changeStatus: async (projectId: string, taskId: string, status: TaskStatusEnum) => {
		const response = await api.put<TaskResponse>(`/projects/${projectId}/tasks/${taskId}/status`, { status });
		return response;
	},

	changeAssignee: async (projectId: string, taskId: string, userId: string) => {
		const response = await api.put<TaskResponse>(`/projects/${projectId}/tasks/${taskId}/assigned-to`, { userId });
		return response;
	},

	changePriority: async (projectId: string, taskId: string, priority: TaskPriorityEnum) => {
		const response = await api.put<TaskResponse>(`/projects/${projectId}/tasks/${taskId}/priority`, { priority });
		return response;
	},

	getTaskLogs: async (projectId: string, taskId: string) => {
		const response = await api.get<TaskLogResponse[]>(`/projects/${projectId}/tasks/${taskId}/logs`);
		return response;
	},

	deleteTask: async (projectId: string, taskId: string) => {
		const response = await api.delete<{ success: boolean }>(`/projects/${projectId}/tasks/${taskId}`);
		return response;
	},
};
