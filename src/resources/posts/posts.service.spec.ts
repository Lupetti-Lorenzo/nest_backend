import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { DatabaseModule } from '../../database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';

describe('PostsService', () => {
	let service: PostsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PostsService],
			imports: [
				DatabaseModule,
				ConfigModule.forRoot({
					load: [configuration],
					envFilePath: ['.env.local'],
				}),
			],
		}).compile();

		service = module.get<PostsService>(PostsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	// find all
	it('should return an array of posts', async () => {
		const posts = await service.findAll({
			$and: [{ $nor: [{ title: 'example' }] }],
			$or: [{ user_id: 1, title: 'example' }, { user_id: 1 }],
		});
		// const posts = await service.findAll({
		// 	$or: [{ user_id: 1, title: 'example' }, { user_id: 1 }],
		// });
		// expect(posts).toEqual([]);
		console.log(posts);
	});
	// it('should return an array of posts', async () => {
	// 	const posts = await service.findAll([
	// 		`user_id = $1 and user_id = $2 and title = $3`,
	// 		[1, 1, `example`],
	// 		[],
	// 	]);
	// 	// expect(posts).toEqual([]);
	// 	console.log(posts);
	// });
});
