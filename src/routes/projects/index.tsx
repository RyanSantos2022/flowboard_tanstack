import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { Textarea } from "#/components/ui/textarea.tsx";
import { createProject, getProjects } from "#/lib/projects.ts";
import { projectSchema } from "#/lib/validators/project.ts";

export const Route = createFileRoute("/projects/")({
	loader: async () => {
		return getProjects();
	},
	component: ProjectsPage,
});

const AVATAR_COLORS = [
	"bg-chart-1/15 text-chart-1",
	"bg-chart-2/15 text-chart-2",
	"bg-chart-3/15 text-chart-3",
	"bg-chart-4/15 text-chart-4",
	"bg-chart-5/15 text-chart-5",
];

function initials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((word) => word[0]?.toUpperCase())
		.join("");
}

function ProjectsPage() {
	const projects = Route.useLoaderData();
	const router = useRouter();
	const form = useForm({
		defaultValues: {
			name: "",
			description: "",
		},

		onSubmit: async ({ value }) => {
			await createProject({
				data: value,
			});

			form.reset();

			await router.invalidate();
		},
	});

	return (
		<div className="mx-auto flex max-w-5xl flex-col gap-10 p-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-bold text-3xl tracking-tight">Projetos</h1>
				<p className="text-muted-foreground">
					Gerencie seus projetos e acompanhe o progresso da equipe.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
				<Card className="h-fit lg:sticky lg:top-6">
					<CardHeader>
						<div className="flex items-center gap-2">
							<div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
								<Plus className="size-4" />
							</div>
							<CardTitle>Novo projeto</CardTitle>
						</div>
						<CardDescription>
							Preencha os dados abaixo para criar um novo projeto.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form
							className="flex flex-col gap-4"
							onSubmit={(event) => {
								event.preventDefault();
								event.stopPropagation();

								form.handleSubmit();
							}}
						>
							<form.Field
								name="name"
								validators={{
									onChange: ({ value }) => {
										const result = projectSchema.shape.name.safeParse(value);

										if (!result.success) {
											return result.error.issues[0]?.message;
										}

										return undefined;
									},
								}}
								// biome-ignore lint/correctness/noChildrenProp: <>
								children={(field) => (
									<div className="flex flex-col gap-2">
										<Label htmlFor={field.name}>Nome</Label>

										<Input
											id={field.name}
											name={field.name}
											placeholder="Ex: Site institucional"
											value={field.state.value}
											aria-invalid={field.state.meta.errors.length > 0}
											onBlur={field.handleBlur}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
										/>

										{field.state.meta.errors.length > 0 && (
											<p className="text-destructive text-sm">
												{field.state.meta.errors[0]}
											</p>
										)}
									</div>
								)}
							/>

							<form.Field
								name="description"
								validators={{
									onChange: ({ value }) => {
										const result =
											projectSchema.shape.description.safeParse(value);

										if (!result.success) {
											return result.error.issues[0]?.message;
										}

										return undefined;
									},
								}}
								// biome-ignore lint/correctness/noChildrenProp: <>
								children={(field) => (
									<div className="flex flex-col gap-2">
										<Label htmlFor={field.name}>Descrição</Label>

										<Textarea
											id={field.name}
											name={field.name}
											placeholder="Do que se trata esse projeto?"
											value={field.state.value}
											aria-invalid={field.state.meta.errors.length > 0}
											onBlur={field.handleBlur}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
										/>

										{field.state.meta.errors.length > 0 && (
											<p className="text-destructive text-sm">
												{field.state.meta.errors[0]}
											</p>
										)}
									</div>
								)}
							/>

							<Button type="submit" className="w-full">
								<Plus className="size-4" />
								Criar projeto
							</Button>
						</form>
					</CardContent>
				</Card>

				{projects.length > 0 ? (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{projects.map((project, index) => (
							<Link
								key={project.id}
								to="/projects/$projectId"
								params={{ projectId: project.id }}
								className="group"
							>
								<Card className="h-full transition-colors group-hover:border-primary/50 group-hover:shadow-md">
									<CardHeader>
										<div
											className={`flex size-9 items-center justify-center rounded-md font-semibold text-sm ${
												AVATAR_COLORS[index % AVATAR_COLORS.length]
											}`}
										>
											{initials(project.name)}
										</div>
										<CardTitle className="truncate pt-2">
											{project.name}
										</CardTitle>
										<CardDescription className="line-clamp-2">
											{project.description || "Sem descrição"}
										</CardDescription>
									</CardHeader>
								</Card>
							</Link>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
						<div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
							<FolderKanban className="size-6" />
						</div>
						<div className="flex flex-col gap-1">
							<p className="font-medium">Nenhum projeto ainda</p>
							<p className="text-muted-foreground text-sm">
								Crie o seu primeiro projeto usando o formulário ao lado.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
