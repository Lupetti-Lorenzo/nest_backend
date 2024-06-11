import {
	Controller,
	Get,
	UseGuards,
	Param,
	Body,
	Post as HttpPost,
	Query,
	NotFoundException,
	Res,
	Req,
	Patch,
	Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Post } from './entities/post.entity';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiTags,
} from '@nestjs/swagger';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { FindOnePathDto } from '../../common/dto/find-one-path.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { Response } from 'express';
import { UpdatePostDto } from './dto/update-post.dto';
import { Action } from '../../common/enums/action.enum';
import {
	AccessGuard,
	UseAbility,
	AccessService,
	CaslConditions,
	ConditionsProxy,
} from 'nest-casl';
import { PostHook } from './posts.hook';
import { SqlConditions } from 'nest-casl/dist/proxies/conditions.proxy';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly accessService: AccessService,
	) {}

	@ApiBadRequestResponse({
		description: 'Validation error: invalid query parameters',
	})
	@UseGuards(JwtAuthGuard, AccessGuard)
	@UseAbility(Action.Read, Post)
	@Get()
	async findAll(
		@Query() query: FindAllQueryDto,
		@CaslConditions() conditions: ConditionsProxy,
		@Req() req,
	) {
		return await this.postsService.findAll(conditions.toMongo());
	}

	@ApiBadRequestResponse({
		description: 'Validation error: id must be a number',
	})
	@ApiNotFoundResponse({ description: 'Post not found' })
	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async findOne(@Param() params: FindOnePathDto, @Req() req): Promise<Post> {
		const post = await this.postsService.findOne(params.id);
		if (!post) throw new NotFoundException('Post not found');
		this.accessService.assertAbility(req.user, Action.Read, post);
		return post;
	}

	@ApiCreatedResponse({
		description: 'The record has been successfully created.',
		headers: {
			Location: {
				description: 'The URL of the created resource.',
				schema: {
					type: 'string',
					format: 'uri',
					example: '/posts/1',
				},
			},
		},
	})
	@ApiBadRequestResponse({ description: 'Validation error: invalid body' })
	@UseGuards(JwtAuthGuard, AccessGuard)
	@UseAbility(Action.Create, Post)
	@HttpPost()
	async create(
		@Body() createPostDto: CreatePostDto,
		@Res() response: Response,
	) {
		const post = await this.postsService.create(createPostDto);
		return response
			.status(201)
			.setHeader('Location', `/posts/${post.id}`)
			.send();
	}

	@ApiBadRequestResponse({
		description: 'Validation error: id must be a number',
	})
	@ApiNotFoundResponse({ description: 'Post not found' })
	@UseGuards(JwtAuthGuard, AccessGuard)
	@UseAbility(Action.Update, Post, PostHook)
	@Patch(':id')
	async update(
		@Param() params: FindOnePathDto,
		@Body() updatePostDto: UpdatePostDto,
	): Promise<Post> {
		const post = await this.postsService.update(params.id, updatePostDto);
		if (!post) throw new NotFoundException('Post not found');
		return post;
	}

	@ApiBadRequestResponse({
		description: 'Validation error: id must be a number',
	})
	@ApiNotFoundResponse({ description: 'Post not found' })
	@UseGuards(JwtAuthGuard, AccessGuard)
	@UseAbility(Action.Delete, Post, PostHook)
	@Delete(':id')
	async delete(@Param() params: FindOnePathDto): Promise<Post> {
		const post = await this.postsService.delete(params.id);
		if (!post) throw new NotFoundException('Post not found');
		return post;
	}
}
