import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { Save } from "lucide-react";
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
import { updateProject } from "#/lib/projects.ts";
import { projectSchema } from "#/lib/validators/project.ts";

type ProjectEditFormProps = {
	project: {
		id: number;
		name: string;
		description: string | null;
	};
};

export function ProjectEditForm({ project }: ProjectEditFormProps) {
	const router = useRouter();

	const form = useForm({
		defaultValues: {
			name: project.name,
			description: project.description ?? "",
		},

		onSubmit: async ({ value }) => {
			await updateProject({
				data: {
					id: project.id,
					name: value.name,
					description: value.description,
				},
			});

			await router.invalidate();
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Editar projeto</CardTitle>
				<CardDescription>
					Atualize as informações do projeto abaixo.
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
									value={field.state.value}
									aria-invalid={field.state.meta.errors.length > 0}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
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
								const result = projectSchema.shape.description.safeParse(value);

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
									value={field.state.value}
									aria-invalid={field.state.meta.errors.length > 0}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
								/>

								{field.state.meta.errors.length > 0 && (
									<p className="text-destructive text-sm">
										{field.state.meta.errors[0]}
									</p>
								)}
							</div>
						)}
					/>

					<Button type="submit" className="self-end">
						<Save className="size-4" />
						Salvar alterações
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
