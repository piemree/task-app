import { type Document, Schema, model } from "mongoose";
import { type TaskDbSchema, taskPriorityEnumSchema, taskStatusEnumSchema } from "../schemas/task.schema";

export interface ITask extends Omit<TaskDbSchema, "_id">, Document {
	_id: string;
}

// Zod enumlarından Mongoose için uygun dizi formatlarını oluşturalım
const statusValues = taskStatusEnumSchema.options;
const priorityValues = taskPriorityEnumSchema.options;

const taskSchema = new Schema<ITask>(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: statusValues,
			default: "pending",
		},
		priority: {
			type: String,
			enum: priorityValues,
			default: "medium",
		},
		project: {
			type: String,
			ref: "Project",
			required: true,
		},
		assignedTo: {
			type: String,
			ref: "User",
			required: true,
		},
		createdBy: {
			type: String,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export const Task = model<ITask>("Task", taskSchema);
