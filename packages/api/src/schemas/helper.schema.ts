import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// ObjectId doğrulama şeması
export const successResponseSchema = z.object({
	success: z.boolean().openapi({
		example: true,
	}),
});

export type SuccessResponse = z.infer<typeof successResponseSchema>;
