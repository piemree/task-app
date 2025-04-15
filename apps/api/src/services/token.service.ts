import jwt from "jsonwebtoken";
import config from "../config/config";
import type { IAuthTokenPayload, IInviteTokenPayload } from "../types/token.types";
export class TokenService {
	generateAuthToken(payload: IAuthTokenPayload) {
		return jwt.sign(payload, config.jwtAuthSecret, { expiresIn: config.jwtAuthExpiresIn });
	}

	verifyAuthToken(token: string) {
		return jwt.verify(token, config.jwtAuthSecret) as IAuthTokenPayload;
	}

	generateInviteToken(payload: IInviteTokenPayload) {
		return jwt.sign(payload, config.jwtInviteSecret, { expiresIn: config.jwtInviteExpiresIn });
	}

	verifyInviteToken(token: string) {
		return jwt.verify(token, config.jwtInviteSecret) as IInviteTokenPayload;
	}
}
