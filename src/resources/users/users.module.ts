import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../../database/database.module';
import { users_permissions as permissions } from './users.permissions';
import { CaslModule } from 'nest-casl';
@Module({
	controllers: [UsersController],
	imports: [DatabaseModule, CaslModule.forFeature({ permissions })],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
