import { useRouter } from "@tanstack/react-router";
import type { InferSelectModel } from "drizzle-orm";
import { Card } from "#/components/ui/card.tsx";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import type { tasks } from "#/db/schema.ts";
import { updateTask } from "#/lib/tasks.ts";

type Task = InferSelectModel<typeof tasks>;

const STATUS_COLUMNS = [
	{ value: "todo", label: "A fazer" },
	{ value: "in_progress", label: "Em progresso" },
	{ value: "done", label: "Concluído" },
] as const;

export function TaskBoard({ tasks }: { tasks: Task[] }) {
	const router = useRouter();

	const columns = {
		todo: tasks.filter((task) => task.status === "todo"),
		in_progress: tasks.filter((task) => task.status === "in_progress"),
		done: tasks.filter((task) => task.status === "done"),
	};

	return (
		<div className="flex flex-col gap-3">
			<h2 className="font-semibold text-xl tracking-tight">Tarefas</h2>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{STATUS_COLUMNS.map((column) => (
					<div
						key={column.value}
						className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-3"
					>
						<div className="flex items-center justify-between px-1">
							<h3 className="font-medium text-sm">{column.label}</h3>
							<span className="text-muted-foreground text-xs">
								{columns[column.value].length}
							</span>
						</div>

						<div className="flex flex-col gap-2">
							{columns[column.value].map((task) => (
								<Card key={task.id} className="gap-0 p-3">
									<p className="text-sm">{task.title}</p>

									<Select
										value={task.status}
										onValueChange={async (status) => {
											const nextStatus = STATUS_COLUMNS.find(
												(item) => item.value === status,
											)?.value;

											if (!nextStatus) {
												return;
											}

											await updateTask({
												data: { id: task.id, status: nextStatus },
											});
											await router.invalidate();
										}}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{STATUS_COLUMNS.map((item) => (
													<SelectItem key={item.value} value={item.value}>
														{item.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</Card>
							))}

							{columns[column.value].length === 0 && (
								<p className="px-1 text-muted-foreground text-xs">
									Nenhuma tarefa
								</p>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
