import { Module } from '@nestjs/common';
import { SeedUsersCommand } from './commands/seed_users.command';
import { UsersModule } from '../resources/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';

@Module({
	providers: [SeedUsersCommand],
	imports: [
		UsersModule,
		ConfigModule.forRoot({ isGlobal: true }),
		DatabaseModule,
	],
})
export class CliModule {}
