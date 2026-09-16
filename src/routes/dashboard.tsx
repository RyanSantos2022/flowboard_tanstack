import { createFileRoute } from "@tanstack/react-router";
import { getProjects } from "#/lib/projects.ts";

export const Route = createFileRoute("/dashboard")({
  loader: async () => {
    const projects = await getProjects()

    return { projects }
  },
	component: Dashboard,
});

function Dashboard() {
  const {projects} = Route.useLoaderData()
	return (
		<div>
			<h1>DashBoard</h1>

      <h2>Meus Projetos</h2>

      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
      ))}
		</div>
	);
}
