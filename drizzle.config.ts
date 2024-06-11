import { defineConfig } from 'drizzle-kit';
export default defineConfig({
	schema: './src/database/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.POSTGRES_URL,
	},
	out: './src/database/migrations',
	verbose: true,
	strict: true,
});
