import { type Document, Schema, model } from "mongoose";
import { type TaskLogDbSchema, logActionEnumSchema } from "../schemas/task-log.schema";
import { taskPriorityEnumSchema, taskStatusEnumSchema } from "../schemas/task.schema";

export interface ITaskLog extends Omit<TaskLogDbSchema, "_id">, Document {
	_id: string;
}

// Zod enumlarından Mongoose için uygun dizi formatlarını oluşturalım
const logActionValues = logActionEnumSchema.options;
const statusValues = taskStatusEnumSchema.options;
const priorityValues = taskPriorityEnumSchema.options;

const taskLogSchema = new Schema<ITaskLog>(
	{
		task: {
			type: String,
			ref: "Task",
			required: true,
		},
		action: {
			type: String,
			enum: logActionValues,
			required: true,
		},
		previousStatus: {
			type: String,
			enum: statusValues,
		},
		newStatus: {
			type: String,
			enum: statusValues,
		},
		previousPriority: {
			type: String,
			enum: priorityValues,
		},
		newPriority: {
			type: String,
			enum: priorityValues,
		},
		previousAssignee: {
			type: String,
			ref: "User",
		},
		newAssignee: {
			type: String,
			ref: "User",
		},
		changedBy: {
			type: String,
			ref: "User",
			required: true,
		},
		changes: {
			type: {
				title: { type: String },
				description: { type: String },
				status: { type: String, enum: statusValues },
				priority: { type: String, enum: priorityValues },
				assignedTo: { type: String, ref: "User" },
			},
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export const TaskLog = model<ITaskLog>("TaskLog", taskLogSchema);
