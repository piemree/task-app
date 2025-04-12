import type { z } from "zod";
import { ZodError } from "zod";

export const validateObject = <T extends z.ZodType>(
	object: Record<string, unknown> | null | undefined,
	schema: T,
): z.infer<T> => {
	// @ts-expect-error - strip() metodu ZodObject'te var ama ZodType'da yok
	const strippedSchema = schema.strip ? schema.strip() : schema;
	const result = strippedSchema.safeParse(object);

	if (!result.success) {
		throw new ZodError(result.error.errors);
	}

	return result.data;
};
