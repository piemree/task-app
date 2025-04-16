import { config } from "./config";

type FetchOptions = RequestInit & {
	params?: Record<string, string>;
	query?: Record<string, string>;
	withAuth?: boolean;
};

async function client<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
	const { params, query, withAuth = true, ...fetchOptions } = options;

	// URL parametrelerini ekle
	const url = new URL(`${config.apiUrl}/api${endpoint}`);
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			url.searchParams.append(key, value);
		}
	}

	if (query) {
		for (const [key, value] of Object.entries(query)) {
			url.searchParams.append(key, value);
		}
	}

	// Default headers
	const headers = new Headers(fetchOptions.headers);
	headers.append("Content-Type", "application/json");

	// Auth header ekle
	if (withAuth) {
		let token = "";

		// Server tarafında mı yoksa client tarafında mı olduğumuzu kontrol et
		if (typeof window === "undefined") {
			// Server-side - cookie'den token'ı al
			try {
				// Dinamik bir import kullanarak server tarafında çalışan bir modül import etme
				const { cookies } = await import("next/headers");
				const cookieStore = await cookies();
				token = cookieStore.get("token")?.value || "";
			} catch (error) {
				console.error("Cookie okuma hatası:", error);
			}
		} else {
			// Client-side - localStorage'dan token'ı al
			token = localStorage.getItem("token") || "";
		}

		if (token) {
			headers.append("Authorization", `Bearer ${token}`);
		}
	}

	const response = await fetch(url.toString(), {
		...fetchOptions,
		headers,
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || `API error: ${response.status}`);
	}

	return response.json();
}

// Helper fonksiyonlar
export const api = {
	get: <T>(endpoint: string, options?: FetchOptions) => client<T>(endpoint, { ...options, method: "GET" }),
	post: <T>(endpoint: string, data?: Record<string, unknown>, options?: FetchOptions) =>
		client<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(data) }),
	put: <T>(endpoint: string, data?: Record<string, unknown>, options?: FetchOptions) =>
		client<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(data) }),
	delete: <T>(endpoint: string, options?: FetchOptions) => client<T>(endpoint, { ...options, method: "DELETE" }),
};
