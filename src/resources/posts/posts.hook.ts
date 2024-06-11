// users.hook.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FindOnePathDto } from '../../common/dto/find-one-path.dto';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';

@Injectable()
export class PostHook implements SubjectBeforeFilterHook<Post, Request> {
	constructor(readonly postsService: PostsService) {}

	async run({ params }: Request) {
		const paramsDto = plainToInstance(FindOnePathDto, params);
		const errors = await validate(paramsDto);

		if (errors.length > 0) {
			// Collect error messages
			const errorMessages = errors.flatMap((err) =>
				Object.values(err.constraints),
			);
			throw new BadRequestException(errorMessages);
		}
		return this.postsService.findOne(params.id);
	}
}
