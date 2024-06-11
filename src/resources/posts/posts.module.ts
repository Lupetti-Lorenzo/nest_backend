import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DatabaseModule } from '../../database/database.module';
import { CaslModule } from 'nest-casl';
import { posts_permissions as permissions } from './posts.permissions';

@Module({
	controllers: [PostsController],
	imports: [DatabaseModule, CaslModule.forFeature({ permissions })],
	providers: [PostsService],
})
export class PostsModule {}
