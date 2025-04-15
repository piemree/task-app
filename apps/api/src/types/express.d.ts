import "express";
import type { ProjectRole } from "../schemas/project.schema";
declare global {
	namespace Express {
		interface Request {
			user?: {
				_id: string;
				email: string;
				projectRole?: ProjectRole;
			};
		}
	}
}
