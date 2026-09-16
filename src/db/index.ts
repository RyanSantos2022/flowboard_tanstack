import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleNodePostgres } from "drizzle-orm/node-postgres";
import * as schema from "./schema.ts";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL não está definida");
}

// Dentro de um Cloudflare Worker, um cliente com socket persistente (node-postgres)
// criado no escopo do módulo é reaproveitado entre requisições de isolados
// diferentes, o que o runtime rejeita ("Cannot perform I/O on behalf of a
// different request"). O driver HTTP do Neon não mantém conexão persistente
// (cada query é um fetch independente), então é seguro nesse ambiente.
const isCloudflareWorker =
	globalThis.navigator?.userAgent === "Cloudflare-Workers";

export const db = isCloudflareWorker
	? drizzleNeonHttp(neon(process.env.DATABASE_URL), { schema })
	: drizzleNodePostgres(process.env.DATABASE_URL, { schema });
