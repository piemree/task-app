import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { convert } from "html-to-text";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: { ignoreTime?: boolean }) {
	return format(new Date(date), options?.ignoreTime ? "dd MMM yyyy" : "dd MMM yyyy HH:mm");
}

export function truncateHtml(htmlContent: string, maxLength = 100) {
	if (!htmlContent) return "-";

	// HTML içeriğini düz metne dönüştür
	const plainText = convert(htmlContent, {
		wordwrap: false,
		selectors: [
			{ selector: "a", options: { ignoreHref: true } },
			{ selector: "img", format: "skip" },
		],
	});

	// Metni kısalt
	if (plainText.length <= maxLength) return plainText;
	return `${plainText.substring(0, maxLength)}...`;
}
