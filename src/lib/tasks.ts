import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { tasks } from "#/db/schema.ts";
import { db } from "../db";
import { taskSchema } from "./validators/task";

export const getTasks = createServerFn({
	method: "GET",
})
	.validator((projectId: number) => projectId)
	.handler(async ({ data }) => {
		return await db.select().from(tasks).where(eq(tasks.projectId, data));
	});

export const createTask = createServerFn({
	method: "POST",
})
	.validator(
		taskSchema.extend({
			projectId: z.number().int().positive(),
		}),
	)
	.handler(async ({ data }) => {
		const [task] = await db
			.insert(tasks)
			.values({
				title: data.title,
				projectId: data.projectId,
				status: data.status,
			})
			.returning();

		return task;
	});

export const updateTask = createServerFn({
	method: "POST",
})
	.validator(
		taskSchema.partial().extend({
			id: z.number().int().positive(),
		}),
	)
	.handler(async ({ data }) => {
		const { id, ...patch } = data;
		const values = Object.fromEntries(
			Object.entries(patch).filter(([, value]) => value !== undefined),
		);

		const [task] = await db
			.update(tasks)
			.set(values)
			.where(eq(tasks.id, id))
			.returning();

		return task;
	});

export const deleteTask = createServerFn({
	method: "POST",
})
	.validator(
		taskSchema.partial().extend({
			id: z.number().int().positive(),
		}),
	)
	.handler(async ({ data }) => {
		return await db.delete(tasks).where(eq(tasks.id, data.id));
	});
