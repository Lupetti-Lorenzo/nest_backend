import { IsNumberString } from 'class-validator';

export class FindOnePathDto {
	@IsNumberString()
	id: number;
}
