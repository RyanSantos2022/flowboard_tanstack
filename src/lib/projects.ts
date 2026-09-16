import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { projects } from "#/db/schema.ts";
import { db } from "../db";
import { projectSchema } from "./validators/project";

export const getProjects = createServerFn({
	method: "GET",
}).handler(async () => {
	return await db.select().from(projects);
});

export const createProject = createServerFn({
	method: "POST",
})
	.validator(projectSchema)
	.handler(async ({ data }) => {
		const [project] = await db
			.insert(projects)
			.values({
				name: data.name,
				description: data.description,
			})
			.returning();

		return project;
	});

export const getProject = createServerFn({
	method: "GET",
})
	.validator((projectId: number) => projectId)
	.handler(async ({ data: projectId }) => {
		const [project] = await db
			.select()
			.from(projects)
			.where(eq(projects.id, projectId));

		return project;
	});

export const updateProject = createServerFn({
	method: "POST",
})
	.validator(
		projectSchema.extend({
			id: z.number().int().positive(),
		}),
	)
	.handler(async ({ data }) => {
		const [project] = await db
			.update(projects)
			.set({
				name: data.name,
				description: data.description,
			})
			.where(eq(projects.id, data.id))
			.returning();

		return project;
	});
