import type { InviteTokenInput, InviteUserInput, ProjectInput, UpdateProjectInput } from "../../schemas/project.schema";

// Proje oluşturma için kullanılacak veriler
export const createProjectData: ProjectInput[] = [
	{
		name: "Web Uygulaması Geliştirme",
		description: "E-ticaret web uygulamasının geliştirilmesi",
	},
	{
		name: "Mobil Uygulama Geliştirme",
		description: "Android ve iOS platformları için mobil uygulama",
	},
	{
		name: "Veritabanı Optimizasyonu",
		description: "Mevcut veritabanı yapısının performans iyileştirmesi",
	},
];

// Proje güncelleme için kullanılacak veriler
export const updateProjectData: UpdateProjectInput[] = [
	{
		name: "Web Uygulaması Geliştirme V2",
		description: "E-ticaret web uygulamasının geliştirilmesi - güncellendi",
	},
	{
		name: "Mobil Uygulama Geliştirme V2",
		description: "Android ve iOS platformları için mobil uygulama - güncellendi",
	},
	{
		name: "Veritabanı Optimizasyonu V2",
		description: "Mevcut veritabanı yapısının performans iyileştirmesi - güncellendi",
	},
];

// Kullanıcı davet etme için kullanılacak veriler
export const inviteUserData: InviteUserInput[] = [
	{
		email: "davet1@example.com",
		role: "admin",
	},
	{
		email: "davet2@example.com",
		role: "manager",
	},
	{
		email: "davet3@example.com",
		role: "developer",
	},
];

// Davet kabul etme için kullanılacak veriler
export const inviteTokenData: InviteTokenInput[] = [
	{
		inviteToken: "davet-token-123456",
	},
	{
		inviteToken: "davet-token-789012",
	},
	{
		inviteToken: "davet-token-345678",
	},
];
