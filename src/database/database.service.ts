import { Injectable } from '@nestjs/common';
import {
	VercelPgDatabase,
	drizzle as drizzleVercel,
} from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import {
	NodePgDatabase,
	drizzle as drizzleLocal,
} from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
	drizzle: NodePgDatabase<typeof schema> | VercelPgDatabase<typeof schema>;

	constructor(private configService: ConfigService) {
		this.initializeDatabase();
	}

	private initializeDatabase() {
		if (
			this.configService
				.get<string>('NODE_ENV') // cannot use node_env, when used by cli does not setup che config
				.toLowerCase()
				.includes('production')
		) {
			this.drizzle = drizzleVercel(sql, { schema });
		} else {
			const connectionString = this.configService.get<string>('database.host');
			const pool = new Pool({
				connectionString,
				ssl: false,
			});
			this.drizzle = drizzleLocal(pool, { schema });
		}
	}
}
