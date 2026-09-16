import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

import { db } from "./index";
import { projects } from "./schema";

await db.insert(projects).values([
	{ name: "Flowboard", description: "Sistema de gerenciamento de projetos" },
	{ name: "Biblioteca", description: "Sistema de gerenciamento de livros" },
]);
