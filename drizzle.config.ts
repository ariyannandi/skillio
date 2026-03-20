import { defineConfig } from 'drizzle-kit';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
	readFileSync('.env', 'utf-8')
		.split('\n')
		.filter((line) => line && !line.startsWith('#'))
		.map((line) => line.split('=').map((s) => s.trim()))
		.filter((parts) => parts.length === 2)
);

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: { url: env.DATABASE_URL },
	verbose: true,
	strict: true
});
