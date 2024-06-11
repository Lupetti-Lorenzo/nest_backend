import { Module } from '@nestjs/common';
import { UsersModule } from './resources/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { validate } from './config/env.validation';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CaslModule } from 'nest-casl';
import { Role } from './common/enums/role.enum';
import { UserContext } from './common/entities/user-context.entity';
import { PostsModule } from './resources/posts/posts.module';

@Module({
	imports: [
		// import modules that have controllers
		UsersModule,
		AuthModule,
		PostsModule,
		// configure config module
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
			validate,
			validationOptions: {
				allowUnknown: false,
				abortEarly: false,
			},
			// expandVariables: true, -- serve per permettere ${...} in env
			// cache: true, -- cache per prod? tanto quando mai le cambio le env in production
		}),
		// define throttler module
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => [
				{
					ttl: config.get<number>('throttle.ttl'),
					limit: config.get<number>('throttle.limit'),
				},
			],
		}),
		CaslModule.forRoot<Role, UserContext, CustomAuthorizableRequest>({
			superuserRole: Role.Admin,
			getUserFromRequest: (request) => request.user, // default
		}),
	],
	// define throttler guard as global guard
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}

interface CustomAuthorizableRequest {
	user: UserContext;
}
