import { plainToInstance } from 'class-transformer';
import {
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	// IsUrl,
	Min,
	validateSync,
} from 'class-validator';
import { IsPostgresUrl } from '../common/decorators/validations/is-postgres-url.decorator';

enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test',
	Provision = 'local',
}

class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment;

	@IsPostgresUrl()
	POSTGRES_URL: string;

	// @IsUrl()
	@IsString()
	AUTH_SERVER_URL: string;

	@IsOptional()
	@IsString()
	AUTH_ISSUER_URL: string;

	@IsString()
	MANAGEMENT_API_CREDENTIALS: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	THROTTLE_TTL: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	THROTTLE_LIMIT: number;
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	});
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}
