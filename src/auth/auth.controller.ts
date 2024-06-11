/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../resources/users/entities/user.entity';
import { UsersService } from '../../src/resources/users/users.service';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}

	@Post('/register')
	async register(@Body() registerUserDto: RegisterUserDto) {
		// qua fare quello che facevo nella register user, devo lanciare eccezioni ecc, magari helpers nel auth service
		const newUser = await this.authService.createUser({
			primaryEmail: registerUserDto.email,
			password: registerUserDto.password,
			username: registerUserDto.username,
			name: registerUserDto.name,
		});
		// // console.log('newUser', newUser);
		// // create user in database
		// return await this.usersService.create({
		// 	sub: newUser.id,
		// 	email: newUser.primaryEmail,
		// });  }
	}
}
