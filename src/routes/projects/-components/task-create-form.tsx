import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { createTask } from "#/lib/tasks.ts";
import { taskSchema } from "#/lib/validators/task.ts";

type CreateTaskFormProps = {
	projectId: number;
};

export function CreateTaskForm({ projectId }: CreateTaskFormProps) {
	const router = useRouter();
	const form = useForm({
		defaultValues: {
			title: "",
			status: "todo" as const,
		},

		onSubmit: async ({ value }) => {
			await createTask({
				data: {
					title: value.title,
					status: value.status,
					projectId,
				},
			});

			form.reset();

			await router.invalidate();
		},
	});

	return (
		<form
			className="flex items-start gap-2"
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.Field
				name="title"
				validators={{
					onChange: ({ value }) => {
						const result = taskSchema.shape.title.safeParse(value);

						if (!result.success) {
							return result.error.issues[0]?.message;
						}

						return undefined;
					},
				}}
				// biome-ignore lint/correctness/noChildrenProp: <>
				children={(field) => (
					<div className="flex flex-1 flex-col gap-2">
						<Label htmlFor={field.name} className="sr-only">
							Título da tarefa
						</Label>

						<Input
							id={field.name}
							name={field.name}
							placeholder="Nova tarefa"
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

			<Button type="submit" size="sm">
				<Plus className="size-4" />
				Adicionar
			</Button>
		</form>
	);
}
