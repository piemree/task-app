// Swagger UI özelleştirmeleri
const initializeSwaggerUI = () => {
	console.log("Swagger UI loaded");
	// Login response'unu dinle
	const originalFetch = window.fetch;
	window.fetch = async (url, options) => {
		const response = await originalFetch(url, options);

		// Login endpoint'ine yapılan istekleri kontrol et
		if (url.includes("/api/auth/login") && options.method === "POST") {
			// Response'u klonla
			const clone = response.clone();

			try {
				const data = await clone.json();
				if (data.token) {
					// Token'ı al ve Authorize butonuna otomatik olarak ekle
					const token = `${data.token}`;

					// Swagger UI'ın Authorize butonunu bul ve tıkla
					const authorizeBtn = document.querySelector(".auth-wrapper button");
					if (authorizeBtn) {
						authorizeBtn.click();

						// Modal açıldıktan sonra token'ı ekle
						setTimeout(() => {
							const tokenInput = document.querySelector(".auth-container input");
							if (tokenInput) {
								// focus input
								tokenInput.focus();
								// select input
								tokenInput.value = token;
								// Authorize butonuna tıkla
								const authorizeSubmitBtn = document.querySelector(".auth-container button");
								if (authorizeSubmitBtn) {
									authorizeSubmitBtn.click();
								}
							}
						}, 100);
					}
				}
			} catch (error) {
				console.error("Token işleme hatası:", error);
			}
		}

		return response;
	};
};

// Swagger UI yüklendiğinde çalıştır
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeSwaggerUI);
} else {
	initializeSwaggerUI();
}
