import { AppError } from "../error/app-error";
import { errorMessages } from "../error/error-messages";
import { User } from "../models/user.model";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { TokenService } from "./token.service";

export class AuthService {
	private tokenService: TokenService;

	constructor() {
		this.tokenService = new TokenService();
	}

	async register(args: { data: RegisterInput }) {
		// Email kontrolü
		const existingUser = await User.findOne({ email: args.data.email });
		if (existingUser) {
			throw new AppError(errorMessages.USER_ALREADY_EXISTS, 400);
		}

		// Yeni kullanıcı oluştur
		const user = await User.create(args.data);

		return user;
	}

	async login(args: { data: LoginInput }) {
		// Kullanıcıyı bul
		const user = await User.findOne({ email: args.data.email });
		if (!user) {
			throw new AppError(errorMessages.USER_NOT_FOUND, 404);
		}

		// Şifreyi kontrol et
		const isPasswordValid = await user.comparePassword(args.data.password);
		if (!isPasswordValid) {
			throw new AppError(errorMessages.INVALID_CREDENTIALS, 401);
		}

		// JWT token oluştur
		const token = this.tokenService.generateAuthToken({ _id: user._id, email: user.email });

		return {
			user,
			token,
		};
	}

	async getUserProfile(args: { userId: string }) {
		const user = await User.findById(args.userId);
		if (!user) {
			throw new AppError(errorMessages.USER_NOT_FOUND, 404);
		}

		return user;
	}
}
