import dotenv from "dotenv";
import type ms from "ms";

dotenv.config();

interface Config {
	port: number;
	nodeEnv: string;
	databaseUrl: string;
	jwtAuthSecret: string;
	jwtAuthExpiresIn: ms.StringValue;
	jwtInviteSecret: string;
	jwtInviteExpiresIn: ms.StringValue;
	mailHost: string;
	mailPort: number;
	mailUser: string;
	mailPass: string;
	frontendUrl: string;
	apiUrl: string;
}

const config: Config = {
	port: Number(process.env.PORT) || 5000,
	nodeEnv: process.env.NODE_ENV || "development",
	databaseUrl: process.env.DATABASE_URL || "",
	jwtAuthSecret: process.env.JWT_AUTH_SECRET || "",
	jwtAuthExpiresIn: (process.env.JWT_AUTH_EXPIRES_IN || "1d") as ms.StringValue,
	jwtInviteSecret: process.env.JWT_INVITE_SECRET || "",
	jwtInviteExpiresIn: (process.env.JWT_INVITE_EXPIRES_IN || "1d") as ms.StringValue,
	frontendUrl: process.env.FRONTEND_URL || "",
	apiUrl: process.env.API_URL || "",
	// Mail
	mailHost: process.env.MAIL_HOST || "",
	mailPort: Number(process.env.MAIL_PORT) || 587,
	mailUser: process.env.MAIL_USER || "",
	mailPass: process.env.MAIL_PASS || "",
};

export default config;
