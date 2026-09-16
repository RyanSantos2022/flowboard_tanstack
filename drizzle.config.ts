import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env.local' })
config({ path: '.env' })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não está definida no .env')
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})