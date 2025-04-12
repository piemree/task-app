import {
	PrismaClientInitializationError,
	PrismaClientKnownRequestError,
	PrismaClientRustPanicError,
	PrismaClientUnknownRequestError,
	PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import type { Response } from "express";

export const handlePrismaError = (
	err:
		| PrismaClientKnownRequestError
		| PrismaClientValidationError
		| PrismaClientUnknownRequestError
		| PrismaClientRustPanicError
		| PrismaClientInitializationError,
	res: Response,
) => {
	// Prisma validasyon hatalarını yakala
	if (err instanceof PrismaClientValidationError) {
		res.status(400).json({
			message: err.message,
		});
		return;
	}

	// Prisma bilinmeyen hata isteklerini yakala
	if (err instanceof PrismaClientUnknownRequestError) {
		res.status(500).json({
			message: err.message,
		});
		return;
	}

	// Prisma Rust panic hatalarını yakala
	if (err instanceof PrismaClientRustPanicError) {
		res.status(500).json({
			message: err.message,
		});
		return;
	}

	// Prisma başlatma hatalarını yakala
	if (err instanceof PrismaClientInitializationError) {
		res.status(500).json({
			message: err.message,
			errorCode: err.errorCode,
		});
		return;
	}

	// Prisma bilinen hata isteklerini yakala
	if (err instanceof PrismaClientKnownRequestError) {
		// Prisma hata kodlarına göre özel mesajlar
		switch (err.code) {
			// Bağlantı hataları (P1000-P1011)
			case "P1000":
			case "P1001":
			case "P1002":
			case "P1003":
			case "P1008":
			case "P1009":
			case "P1010":
			case "P1011":
				res.status(500).json({
					message: err.message,
				});
				break;

			// Şema hataları (P1012)
			case "P1012":
				res.status(400).json({
					message: err.message,
				});
				break;

			// Veritabanı işlem hataları (P2000-P2025)
			case "P2000":
			case "P2001":
			case "P2002":
			case "P2003":
			case "P2004":
			case "P2005":
			case "P2006":
			case "P2007":
			case "P2008":
			case "P2009":
			case "P2010":
			case "P2011":
			case "P2012":
			case "P2013":
			case "P2014":
			case "P2015":
			case "P2016":
			case "P2017":
			case "P2018":
			case "P2019":
			case "P2020":
			case "P2021":
			case "P2022":
			case "P2023":
			case "P2024":
			case "P2025":
				// Benzersiz alan çakışması
				if (err.code === "P2002") {
					res.status(409).json({
						message: err.message,
						field: err.meta?.target as string,
					});
				}
				// Kayıt bulunamadı
				else if (err.code === "P2025") {
					res.status(404).json({
						message: err.message,
					});
				}
				// İlişkili kayıt bulunamadı
				else if (err.code === "P2003") {
					res.status(400).json({
						message: err.message,
						field: err.meta?.field_name as string,
					});
				}
				// Diğer veritabanı işlem hataları
				else {
					res.status(400).json({
						message: err.message,
					});
				}
				break;

			// Veritabanı özellik hataları (P2026-P2037)
			case "P2026":
			case "P2027":
			case "P2028":
			case "P2029":
			case "P2030":
			case "P2031":
			case "P2033":
			case "P2034":
			case "P2035":
			case "P2036":
			case "P2037":
				res.status(400).json({
					message: err.message,
				});
				break;

			// Varsayılan durum
			default:
				res.status(400).json({
					message: err.message,
				});
		}
	}
};
