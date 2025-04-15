import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { Types } from "mongoose";
import { z } from "zod";

extendZodWithOpenApi(z);

// ObjectId doğrulama şeması
export const objectIdSchema = z
	.string()
	.refine((id) => Types.ObjectId.isValid(id), { message: "Invalid ObjectId format" })
	.openapi({
		example: "60d0fe4f5311236168a109ca",
	});
