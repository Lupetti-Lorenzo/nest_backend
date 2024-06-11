// this file is used to define the data transfer object for the register user endpoint
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import { Match } from '../../common/decorators/validations/match.decorator';

export class RegisterUserDto {
	/**
	 * User email
	 * @example 'example@gmail.com'
	 */
	@IsEmail()
	email: string;
	/**
	 * User password
	 * @example 'password'
	 */
	@IsString()
	@MinLength(8)
	@MaxLength(20)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'La password è troppo debole',
	})
	password: string;

	/**
	 * User password confirmation
	 * @example 'password'
	 */
	@IsString()
	@MinLength(8)
	@MaxLength(20)
	@Match('password', {
		message: 'La password di conferma è diversa da quella originale',
	}) // Confronta con il campo 'password'
	passwordConfirm: string;

	/**
	 * User username
	 * @example 'example'
	 */
	@IsNotEmpty()
	@IsString()
	username: string;
	/**
	 * User name
	 * @example 'John Doe'
	 */
	@IsNotEmpty()
	@IsString()
	name: string;
}
