import type { UserResponse } from "@schemas/auth.schema";
import type { NotificationSocketSchema } from "@schemas/notification.schema";
import { type Socket, io } from "socket.io-client";

// AuthState tipi auth slice'dan alınıyor
type AuthState = {
	user: UserResponse | null;
	token: string | null;
	isAuthenticated?: boolean;
	isLoading: boolean;
	error: string | null;
};

class SocketService {
	private socket: Socket | null = null;
	private token: string | null = null;

	constructor() {
		this.socket = null;
	}

	public init(auth: AuthState) {
		if ((!auth.isAuthenticated && !auth.user) || !auth.token) {
			return;
		}

		if (this.socket && this.token === auth.token) {
			return;
		}

		// Mevcut bağlantıyı kapat
		if (this.socket) {
			this.socket.disconnect();
		}

		const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

		this.token = auth.token;
		this.socket = io(API_URL, {
			auth: {
				token: auth.token,
			},
			transports: ["websocket"],
			autoConnect: true,
		});

		this.socket.on("connect", () => {
			console.log("Socket bağlantısı kuruldu");
		});

		this.socket.on("connect_error", (error) => {
			console.error("Socket bağlantı hatası:", error);
		});

		this.socket.on("disconnect", (reason) => {
			console.log("Socket bağlantısı kesildi:", reason);
		});
	}

	public onProjectNotification(callback: (data: NotificationSocketSchema) => void) {
		if (!this.socket) {
			return () => {};
		}

		this.socket.on("project-notification", callback);

		return () => {
			this.socket?.off("project-notification", callback);
		};
	}

	public disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
			this.token = null;
		}
	}
}

export const socketService = new SocketService();
