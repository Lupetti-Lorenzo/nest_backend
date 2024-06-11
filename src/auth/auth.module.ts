import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UsersModule } from '../resources/users/users.module';
import { AuthService } from './auth.service';

@Module({
	controllers: [AuthController],
	imports: [
		PassportModule.register({
			session: false,
		}),
		UsersModule,
	],
	providers: [JwtStrategy, JwtAuthGuard, AuthService],
	exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
