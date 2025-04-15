// Socket auth middleware

import type { Socket } from "socket.io";
import { TokenService } from "../services/token.service";

const tokenService = new TokenService();

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error | undefined) => void) => {
	const token = socket.handshake.auth.token;

	if (!token) {
		return next(new Error("Socket authentication error"));
	}

	try {
		const decoded = tokenService.verifyAuthToken(token as string);
		socket.user = decoded;
		next();
	} catch (error) {
		return next(new Error("Socket authentication error"));
	}
};
