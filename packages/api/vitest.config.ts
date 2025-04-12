import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
		},
		include: ["**/*.test.ts"],
		setupFiles: ["./vitest.setup.ts"],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
