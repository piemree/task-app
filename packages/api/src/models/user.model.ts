import bcrypt from "bcryptjs";
import { type CallbackError, type Document, Schema, model } from "mongoose";
import type { UserInput } from "../schemas/auth.schema";

export interface IUser extends UserInput, Document {
	_id: string;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		versionKey: false,
	},
);

// Şifre hashleme middleware
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password as string, salt);
		next();
	} catch (error: unknown) {
		next(error as CallbackError);
	}
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>("User", userSchema);
