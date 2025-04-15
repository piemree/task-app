import type {
	LoginInput,
	LoginResponse,
	RegisterInput,
	RegisterResponse,
	UpdateUserProfileInput,
	UserResponse,
} from "@schemas/auth.schema";
import { api } from "../lib/api";

export const authService = {
	register: async (data: RegisterInput) => {
		const response = await api.post<RegisterResponse>("/auth/register", data);
		return response;
	},

	login: async (data: LoginInput) => {
		const response = await api.post<LoginResponse>("/auth/login", data);
		return response;
	},

	getProfile: async () => {
		const response = await api.get<UserResponse>("/auth/profile");
		return response;
	},

	updateProfile: async (data: UpdateUserProfileInput) => {
		const response = await api.put<UserResponse>("/auth/profile", data);
		return response;
	},
};
