// users.hook.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FindOnePathDto } from '../../common/dto/find-one-path.dto';

@Injectable()
export class UserHook implements SubjectBeforeFilterHook<User, Request> {
	constructor(readonly userService: UsersService) {}

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
		return this.userService.findOne(params.id);
	}
}
