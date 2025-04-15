import request from "supertest";
import app from "../../app";
import type { LoginResponse, RegisterInput } from "../../schemas/auth.schema";

export const setupUser = async (data: RegisterInput) => {
	try {
		// Önce kullanıcı kaydı yap
		const registerResponse = await request(app).post("/api/auth/register").send(data);

		if (registerResponse.status !== 201 && registerResponse.status !== 200) {
			throw new Error(`Kullanıcı kaydı başarısız: ${JSON.stringify(registerResponse.body)}`);
		}

		// Sonra giriş yap
		const loginResponse = await request(app).post("/api/auth/login").send({
			email: data.email,
			password: data.password,
		});

		if (loginResponse.status !== 200) {
			throw new Error(`Kullanıcı girişi başarısız: ${JSON.stringify(loginResponse.body)}`);
		}

		return loginResponse.body as LoginResponse;
	} catch (error) {
		console.error("Setup user error:", error);
		throw error;
	}
};
