import type { LoginInput, RegisterInput, UpdateUserProfileInput } from "../../schemas/auth.schema";

// Kayıt işlemi için kullanılacak veriler
export const registerUserData: RegisterInput[] = [
	{
		firstName: "Ahmet",
		lastName: "Yılmaz",
		email: "ahmet.yilmaz@example.com",
		password: "Sifre123!",
	},
	{
		firstName: "Ayşe",
		lastName: "Demir",
		email: "ayse.demir@example.com",
		password: "Parola456!",
	},
	{
		firstName: "Mehmet",
		lastName: "Kaya",
		email: "mehmet.kaya@example.com",
		password: "Guvenli789!",
	},
];

// Giriş işlemi için kullanılacak veriler
export const loginUserData: LoginInput[] = [
	{
		email: "ahmet.yilmaz@example.com",
		password: "Sifre123!",
	},
	{
		email: "ayse.demir@example.com",
		password: "Parola456!",
	},
	{
		email: "mehmet.kaya@example.com",
		password: "Guvenli789!",
	},
];

// Profil güncelleme için kullanılacak veriler
export const updateProfileData: UpdateUserProfileInput[] = [
	{
		firstName: "Ahmet Yeni",
		lastName: "Yılmaz Yeni",
	},
	{
		firstName: "Ayşe Yeni",
		lastName: "Demir Yeni",
	},
	{
		firstName: "Mehmet Yeni",
		lastName: "Kaya Yeni",
	},
];
