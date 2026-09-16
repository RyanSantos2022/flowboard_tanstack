import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { Button } from "#/components/ui/button.tsx";
import { getProject } from "#/lib/projects.ts";
import { getTasks } from "#/lib/tasks.ts";
import { ProjectEditForm } from "./-components/project-edit-form.tsx";
import { ProjectNotFound } from "./-components/project-not-found.tsx";
import { TaskBoard } from "./-components/task-board.tsx";
import { CreateTaskForm } from "./-components/task-create-form.tsx";

export const Route = createFileRoute("/projects/$projectId")({
	params: {
		parse: (params) => ({
			projectId: z.coerce.number().int().positive().parse(params.projectId),
		}),
	},
	loader: async ({ params }) => {
		const [project, tasks] = await Promise.all([
			getProject({
				data: params.projectId,
			}),
			getTasks({
				data: params.projectId,
			}),
		]);

		if (!project) {
			throw notFound();
		}

		return { project, tasks };
	},
	notFoundComponent: () => <ProjectNotFound />,
	component: ProjectPage,
});

function ProjectPage() {
	const { project, tasks } = Route.useLoaderData();

	return (
		<div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
			<div className="flex flex-col gap-4">
				<Button asChild variant="ghost" size="sm" className="w-fit -ml-2">
					<Link to="/projects">
						<ArrowLeft className="size-4" />
						Projetos
					</Link>
				</Button>

				<div className="flex flex-col gap-1">
					<h1 className="font-bold text-3xl tracking-tight">{project.name}</h1>
					<p className="text-muted-foreground text-sm">
						Criado em{" "}
						{new Date(project.createdAt).toLocaleDateString("pt-BR", {
							day: "2-digit",
							month: "long",
							year: "numeric",
						})}
					</p>
				</div>
			</div>

			<ProjectEditForm project={project} />

			<TaskBoard tasks={tasks} />

			<CreateTaskForm projectId={project.id} />
		</div>
	);
}
