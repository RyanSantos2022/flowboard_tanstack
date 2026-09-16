import {
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const taskStatus = pgEnum("task_status", [
	"todo",
	"in_progress",
	"done",
]);

export const tasks = pgTable("tasks", {
	id: serial("id").primaryKey(),
	projectId: integer("project_id")
		.notNull()
		.references(() => projects.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	status: taskStatus("status").notNull().default("todo"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
