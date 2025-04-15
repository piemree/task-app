import type http from "node:http";
import { Server } from "socket.io";
import { projectRoomMiddleware } from "../middlewares/project-room.middleware";
import { socketAuthMiddleware } from "../middlewares/socket-auth.middleware";
import config from "./config";
let io: Server;

export const setupSocket = (server: http.Server) => {
	io = new Server(server, {
		cors: {
			origin: "*",
		},
	});

	io.use(socketAuthMiddleware);
	io.use(projectRoomMiddleware);
};

export const getIO = () => {
	if (config.nodeEnv === "test") {
		return null;
	}
	if (!io) {
		throw new Error("Socket.io not initialized");
	}
	return io;
};
