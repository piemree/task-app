// Socket project room auto-join middleware

import type { Socket } from "socket.io";
import { ProjectService } from "../services/project.service";

const projectService = new ProjectService();

export const projectRoomMiddleware = async (socket: Socket, next: (err?: Error | undefined) => void) => {
	try {
		if (!socket.user) {
			return next();
		}

		// Kullanıcının sahip olduğu tüm projeleri getir
		const userProjects = await projectService.getProjects(socket.user._id);

		// Kullanıcıyı her proje odasına katıl
		for (const project of userProjects) {
			socket.join(`project:${project._id}`);
		}

		next();
	} catch (error) {
		console.error("Project room middleware error:", error);
		next();
	}
};
