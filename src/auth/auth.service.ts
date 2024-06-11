/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import axios from 'axios';
import { AuthUser } from './entities/auth-user.entity';
import { CreateAuthUserDto } from './dto/create-auth-user.dto';

@Injectable()
export class AuthService {
	private auth_server_url: string; // if logto is used, this will be the logto server url, not the menumal one

	constructor(private configService: ConfigService) {
		this.auth_server_url = configService.get<string>('auth.server_url');
	}

	async createUser(userData: CreateAuthUserDto): Promise<AuthUser> {
		const userUrl = `${this.auth_server_url}/api/users`;
		const token = await this.getManagementAPIAccessToken();
		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		};
		try {
			const response = await axios.post(userUrl, userData, { headers });
			return response.data;
		} catch (error) {
			console.error('Error creating user:', error.response.data);
			throw error;
		}
	}

	private async getManagementAPIAccessToken(): Promise<string> {
		const tokenEndpoint = `${this.auth_server_url}/oidc/token`;
		const clientCredentials = this.configService.get<string>(
			'auth.management_api_credentials',
		);
		const headers = {
			Authorization: `Basic ${clientCredentials}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		};

		const data = qs.stringify({
			grant_type: 'client_credentials',
			resource: `${this.auth_server_url}/api`,
			scope: 'all',
		});

		try {
			const response = await axios.post(tokenEndpoint, data, { headers });
			if (response.data && response.data.access_token) {
				return response.data.access_token;
			} else {
				throw new Error('Token not found in response');
			}
		} catch (error) {
			console.error('Error fetching logto management api token:', error);
			throw error;
		}
	}
}
