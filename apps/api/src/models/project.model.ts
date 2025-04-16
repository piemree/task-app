import { type Document, Schema, model } from "mongoose";
import { type ProjectDbSchema, userProjectRoleSchema } from "../schemas/project.schema";

export interface IProject extends Omit<ProjectDbSchema, "_id">, Document {
	_id: string;
}

const projectSchema = new Schema<IProject>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		owner: {
			type: String,
			ref: "User",
			required: true,
		},
		members: [
			{
				user: { type: String, ref: "User" },
				role: {
					type: String,
					enum: userProjectRoleSchema.enum,
					required: true,
					default: userProjectRoleSchema.enum.developer,
				},
			},
		],
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export const Project = model<IProject>("Project", projectSchema);
