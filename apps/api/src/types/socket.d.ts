// Socket types

import type { Socket } from "socket.io";

declare module "socket.io" {
	interface Socket {
		user?: {
			_id: string;
			email: string;
			projectRole?: ProjectRole;
		};
	}
}
