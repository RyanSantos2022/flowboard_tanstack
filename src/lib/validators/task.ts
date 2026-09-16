import { z } from "zod";
import { taskStatus } from "#/db/schema.ts";

export const taskSchema = z.object({
	title: z
		.string()
		.min(3, "O título deve ter pelo menos 3 caracteres")
		.max(200, "O título deve ter no máximo 200 caracteres"),
	status: z.enum(taskStatus.enumValues).default("todo"),
});
