import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.ts";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL não está definida");
}

export const db = drizzle(process.env.DATABASE_URL, { schema });
