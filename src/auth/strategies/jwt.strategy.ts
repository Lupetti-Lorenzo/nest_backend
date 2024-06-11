/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UserContext } from '../../common/entities/user-context.entity';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(configService: ConfigService) {
		const AUTH_SERVER_URL = configService.get<string>('auth.server_url');
		const AUTH_ISSUER_URL = configService.get<string>('auth.issuer_url');
		super({
			secretOrKeyProvider: passportJwtSecret({
				cache: true,
				rateLimit: true,
				jwksRequestsPerMinute: 5,
				jwksUri: `${AUTH_SERVER_URL}/oidc/jwks`,
			}),

			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			issuer: `${AUTH_ISSUER_URL || AUTH_SERVER_URL}/oidc`,
			algorithms: ['ES384'],
		});
		console.log('AUTH_SERVER_URL: ', AUTH_SERVER_URL);
	}

	validate(payload: JWTPayload): UserContext {
		// console.log('Validating payload:', payload);
		return {
			id: 1,
			username: payload.sub,
			// roles: cleanRoles(payload.roles) as Role[],
			roles: [Role.User],
			organizationId: payload.organizations[0],
		};
	}
}

function cleanRoles(roles: string[]): string[] {
	return roles.map((role) => {
		// Check if the role contains a colon
		if (role.includes(':')) {
			// Split the role by the colon and return the part after the colon
			return role.split(':')[1];
		} else {
			// Return the role as is if it doesn't contain a colon
			return role;
		}
	});
}

interface JWTPayload {
	sub: string;
	iss: string;
	aud: string;
	iat: number;
	exp: number;
	roles: string[];
	organizations: string[];
	organization_roles: string[];
}
