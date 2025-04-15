import { LogActionEnum, type TaskChanges, type TaskLogInput } from "../../schemas/task-log.schema";

// Görev log verileri için kullanılacak değişiklik verileri
export const taskChangesData: TaskChanges[] = [
	{
		title: "Eski Başlık 1",
		description: "Eski Açıklama 1",
	},
	{
		status: "pending",
		priority: "low",
	},
	{
		assignedTo: "60d5ec41c8a2f0a9c8c8f0a1",
	},
];

// Görev log oluşturma için kullanılacak veriler
export const taskLogData: TaskLogInput[] = [
	{
		task: "60f5fc41c8a2f0a9c8c8f0c1", // Referans için görev ID'si
		action: "updated",
		previousStatus: "pending",
		newStatus: "in_progress",
		changedBy: "60d5ec41c8a2f0a9c8c8f0a1", // Referans için kullanıcı ID'si
		changes: {
			title: "Eski Başlık",
			description: "Eski Açıklama",
		},
	},
	{
		task: "60f5fc41c8a2f0a9c8c8f0c2",
		action: "status_changed",
		previousStatus: "in_progress",
		newStatus: "completed",
		changedBy: "60d5ec41c8a2f0a9c8c8f0a2",
		changes: {},
	},
	{
		task: "60f5fc41c8a2f0a9c8c8f0c3",
		action: "priority_changed",
		previousPriority: "low",
		newPriority: "high",
		changedBy: "60d5ec41c8a2f0a9c8c8f0a3",
		changes: {},
	},
	{
		task: "60f5fc41c8a2f0a9c8c8f0c1",
		action: "assigned",
		previousAssignee: "60d5ec41c8a2f0a9c8c8f0a1",
		newAssignee: "60d5ec41c8a2f0a9c8c8f0a2",
		changedBy: "60d5ec41c8a2f0a9c8c8f0a3",
		changes: {},
	},
];
