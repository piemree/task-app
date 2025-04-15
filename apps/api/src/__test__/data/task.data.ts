import type { TaskInput, TaskPriorityEnum, TaskStatusEnum, UpdateTaskInput } from "../../schemas/task.schema";

// Görev oluşturma için kullanılacak veriler
export const createTaskData: TaskInput[] = [
	{
		title: "Arayüz Tasarımı",
		description: "Web uygulaması için arayüz tasarımı yapılacak",
		status: "pending",
		priority: "medium",
		assignedTo: "60d5ec41c8a2f0a9c8c8f0a1", // Referans için kullanıcı ID'si
	},
	{
		title: "API Geliştirme",
		description: "Backend API endpointlerinin geliştirilmesi",
		status: "in_progress",
		priority: "high",
		assignedTo: "60d5ec41c8a2f0a9c8c8f0a2",
	},
	{
		title: "Veritabanı Modelleri",
		description: "Veritabanı modellerinin oluşturulması",
		status: "completed",
		priority: "low",
		assignedTo: "60d5ec41c8a2f0a9c8c8f0a3",
	},
];

// Görev güncelleme için kullanılacak veriler
export const updateTaskData: UpdateTaskInput[] = [
	{
		title: "Arayüz Tasarımı - Güncellendi",
		description: "Web uygulaması için arayüz tasarımı yapılacak - revize",
	},
	{
		title: "API Geliştirme - Güncellendi",
		description: "Backend API endpointlerinin geliştirilmesi - ek özellikler",
	},
	{
		title: "Veritabanı Modelleri - Güncellendi",
		description: "Veritabanı modellerinin oluşturulması - performans iyileştirmeleri",
	},
];

// Görev durumu değiştirme için kullanılacak veriler
export const taskStatusData: TaskStatusEnum[] = ["pending", "in_progress", "completed"];

// Görev önceliğini değiştirme için kullanılacak veriler
export const taskPriorityData: TaskPriorityEnum[] = ["low", "medium", "high"];
