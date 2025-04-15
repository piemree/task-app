import type { JwtPayload } from "jsonwebtoken";
import type { ProjectRole } from "../schemas/project.schema";

export interface IAuthTokenPayload extends JwtPayload {
	_id: string;
	email: string;
}

export interface IInviteTokenPayload extends JwtPayload {
	projectId: string;
	email: string;
	role: ProjectRole;
}
