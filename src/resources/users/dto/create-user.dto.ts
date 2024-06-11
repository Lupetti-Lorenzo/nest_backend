import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
	/**
	 * User email
	 * @example 'example@gmail.com'
	 */
	@IsEmail()
	email: string;

	/**
	 * User sub
	 * @example 'a242af'
	 */
	@IsNotEmpty()
	@IsString()
	sub: string;
}
