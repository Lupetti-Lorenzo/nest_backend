import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllQueryDto {
	@IsOptional()
	@IsInt()
	@Min(0)
	@Type(() => Number)
	limit?: number = 50;

	@IsOptional()
	@IsInt()
	@Min(0)
	@Type(() => Number)
	offset?: number = 0;
}
