import type {
	InviteTokenInput,
	InviteUserInput,
	ProjectInput,
	ProjectResponse,
	UpdateProjectInput,
} from "@schemas/project.schema";
import { api } from "../lib/api";

export const projectService = {
	createProject: async (data: ProjectInput) => {
		const response = await api.post<ProjectResponse>("/projects", data);
		return response;
	},

	getProjects: async () => {
		const response = await api.get<ProjectResponse[]>("/projects");
		return response;
	},

	getProject: async (id: string) => {
		const response = await api.get<ProjectResponse>(`/projects/${id}`);
		return response;
	},

	updateProject: async (id: string, data: UpdateProjectInput) => {
		const response = await api.put<ProjectResponse>(`/projects/${id}`, data);
		return response;
	},

	deleteProject: async (id: string) => {
		await api.delete<ProjectResponse>(`/projects/${id}`);
		return { success: true };
	},

	inviteUser: async (projectId: string, data: InviteUserInput) => {
		await api.post<ProjectResponse>(`/projects/${projectId}/invite`, data);
		return { success: true };
	},

	acceptInvite: async (data: InviteTokenInput) => {
		const response = await api.post<{ success: boolean; isUnRegistered: boolean }>("/projects/accept-invite", data);
		return response;
	},

	removeMember: async (projectId: string, userId: string) => {
		await api.delete<ProjectResponse>(`/projects/${projectId}/members/${userId}`);
		return { success: true };
	},
};
