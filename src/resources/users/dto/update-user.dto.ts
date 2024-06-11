/* eslint-disable @typescript-eslint/no-unused-vars */
import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends OmitType(CreateUserDto, ['sub'] as const) {}
export class UpdateUserDto extends PartialType(CreateUserDto) {}
