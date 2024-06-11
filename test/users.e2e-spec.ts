import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UpdateUserDto } from '../src/resources/users/dto/update-user.dto';
import { CreateUserDto } from '../src/resources/users/dto/create-user.dto';
import { UsersModule } from '../src/resources/users/users.module';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/configuration';
import { validate } from '../src/config/env.validation';

describe('UsersController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				UsersModule,
				// DatabaseModule,
				ConfigModule.forRoot({
					isGlobal: true,
					load: [configuration],
					validate,
				}),
			],
		})
			.overrideGuard(JwtAuthGuard) // Override JwtAuthGuard
			.useValue({
				// always return true and set the user role to Admin
				canActivate: jest.fn().mockImplementation(() => {
					return true;
				}),
			})
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
				//   disableErrorMessages: true,
			}),
		);

		await app.init();
	});

	describe('GET /users', () => {
		it('should return all users', () => {
			return request(app.getHttpServer()).get('/users').expect(200);
		});

		it('should return a validation error for invalid limit', () => {
			return request(app.getHttpServer()).get('/users?limit=-1').expect(400);
		});
	});

	describe('GET /users/:id', () => {
		it('should return a user by ID', () => {
			return request(app.getHttpServer()).get('/users/11').expect(200).expect({
				id: 11,
				email: 'test@example.com',
				sub: '123',
			});
		});

		it('should return 404 for a non-existent user', () => {
			return request(app.getHttpServer())
				.get('/users/999') // Assuming user with ID 999 does not exist
				.expect(404);
		});

		it('should return a validation error for invalid ID', () => {
			return request(app.getHttpServer()).get('/users/abc').expect(400);
		});
	});
	let newUserLocation: string;
	let createUserDto: CreateUserDto;
	describe('POST /users', () => {
		it('should create a new user', async () => {
			createUserDto = {
				email: 'test@example.com',
				sub: '123',
			};
			const createResponse = await request(app.getHttpServer())
				.post('/users')
				.send(createUserDto)
				.expect(201);

			// Extract the user ID from the Location header
			newUserLocation = createResponse.headers['location'];
			expect(newUserLocation).toBeDefined();
		});

		it('should return a validation error for invalid data', () => {
			const invalidCreateUserDto = { email: 'test.mail.com' }; // Missing required fields, causing validation error
			return request(app.getHttpServer())
				.post('/users')
				.send(invalidCreateUserDto)
				.expect(400);
		});
	});

	describe('PATCH /users/:id', () => {
		it('should update a user by ID', () => {
			const updateUserDto: UpdateUserDto = {
				email: 'updated@example.com',
			};
			return request(app.getHttpServer())
				.patch('/users/12') // Assuming you have an endpoint to update a user by ID
				.send(updateUserDto)
				.expect(200)
				.expect({
					id: 12,
					email: 'updated@example.com',
					sub: '123',
				});
		});

		it('should return 404 for a non-existent user', () => {
			const updateUserDto: UpdateUserDto = {
				email: 'updated@example.com',
			};
			return request(app.getHttpServer())
				.patch('/users/999') // Assuming user with ID 999 does not exist
				.send(updateUserDto)
				.expect(404);
		});

		it('should return a validation error for invalid data', () => {
			const invalidUpdateUserDto = { email: 'test.mail.com' }; // Invalid email format
			return request(app.getHttpServer())
				.patch('/users/1')
				.send(invalidUpdateUserDto)
				.expect(400);
		});
	});

	describe('DELETE /users/:id', () => {
		it('should delete a user by ID', async () => {
			const newUserId = newUserLocation.split('/').pop();

			return request(app.getHttpServer())
				.delete(newUserLocation)
				.expect(200)
				.expect({
					id: parseInt(newUserId),
					...createUserDto,
				});
		});

		it('should return 404 for a non-existent user', () => {
			return request(app.getHttpServer())
				.delete('/users/999') // Assuming user with ID 999 does not exist
				.expect(404);
		});

		it('should return a validation error for invalid ID', () => {
			return request(app.getHttpServer()).delete('/users/abc').expect(400);
		});
	});
});
