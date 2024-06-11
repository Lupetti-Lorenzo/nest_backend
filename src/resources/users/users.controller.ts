/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Controller,
	Get,
	UseGuards,
	Param,
	Body,
	Post,
	Query,
	NotFoundException,
	Res,
	Req,
	Patch,
	Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiTags,
} from '@nestjs/swagger';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { FindOnePathDto } from '../../common/dto/find-one-path.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { Action } from '../../common/enums/action.enum';
import { AccessGuard, UseAbility, AccessService } from 'nest-casl';
import { UserHook } from './users.hook';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly accessService: AccessService,
	) {}

	@ApiBadRequestResponse({
		description: 'Validation error: invalid query parameters',
	})
	@UseGuards(JwtAuthGuard, AccessGuard)
	@UseAbility(Action.Manage, User)
	@Get()
	async findAll(@Query() query: FindAllQueryDto) {
		// const { limit, offset } = query;
		return await this.usersService.findAll();
	}

	@ApiBadRequestResponse({
		description: 'Validation error: id must be a number',
	})
	@ApiNotFoundResponse({ description: 'User not found' })
	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async findOne(@Param() params: FindOnePathDto, @Req() req): Promise<User> {
		const user = await this.usersService.findOne(params.id);
		if (!user) throw new NotFoundException('User not found');
		this.accessService.assertAbility(req.user, Action.Read, user);
		return user;
	}

	@ApiCreatedResponse({
		description: 'The record has been successfully created.',
		headers: {
			Location: {
				description: 'The URL of the created resource.',
				schema: {
					type: 'string',
					format: 'uri',
					example: '/users/1',
				},
			},
		},
	})
	@ApiBadRequestResponse({ description: 'Validation error: invalid body' })
	@UseGuards(JwtAuthGuard, AccessGuard)
	@UseAbility(Action.Create, User)
	@Post()
	async create(
		@Body() createUserDto: CreateUserDto,
		@Res() response: Response,
	) {
		const user = await this.usersService.create(createUserDto);
		return response
			.status(201)
			.setHeader('Location', `/users/${user.id}`)
			.send();
	}

	@ApiBadRequestResponse({
		description: 'Validation error: id must be a number',
	})
	@ApiNotFoundResponse({ description: 'User not found' })
	@UseGuards(JwtAuthGuard, AccessGuard)
	@UseAbility(Action.Update, User, UserHook)
	@Patch(':id')
	async update(
		@Param() params: FindOnePathDto,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<User> {
		const user = await this.usersService.update(params.id, updateUserDto);
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	@ApiBadRequestResponse({
		description: 'Validation error: id must be a number',
	})
	@ApiNotFoundResponse({ description: 'User not found' })
	@UseGuards(JwtAuthGuard, AccessGuard)
	@UseAbility(Action.Delete, User, UserHook)
	@Delete(':id')
	async delete(@Param() params: FindOnePathDto): Promise<User> {
		const user = await this.usersService.delete(params.id);
		if (!user) throw new NotFoundException('User not found');
		return user;
	}
}
