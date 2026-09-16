import { Link } from "@tanstack/react-router";
import { ArrowLeft, FolderX } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";

export function ProjectNotFound() {
	return (
		<div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3 p-6 py-24 text-center">
			<div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
				<FolderX className="size-6" />
			</div>
			<div className="flex flex-col gap-1">
				<p className="font-medium">Projeto não encontrado</p>
				<p className="text-muted-foreground text-sm">
					O projeto que você está procurando não existe.
				</p>
			</div>
			<Button asChild variant="outline" className="mt-2">
				<Link to="/projects">
					<ArrowLeft className="size-4" />
					Voltar para projetos
				</Link>
			</Button>
		</div>
	);
}
