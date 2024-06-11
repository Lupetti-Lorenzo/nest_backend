import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreatePostDto {
	@IsInt()
	@Min(0)
	user_id: number;
	/**
	 * Post title
	 * @example 'Post title'
	 */
	@IsNotEmpty()
	@IsString()
	title: string;
}
