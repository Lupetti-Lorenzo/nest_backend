import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { requestMock, responseMock } from '../../../test/mocks/basics.mock';

describe('UsersController', () => {
	let controller: UsersController;
	let service: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [UsersService],
		})
			.overrideProvider(UsersService)
			.useValue(mockUsersService)
			.compile();

		controller = module.get<UsersController>(UsersController);
		service = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('findAll', () => {
		it('should return an array of users', async () => {
			const result = [
				{ id: 1, email: 'test@email.com', sub: '31' },
				{ id: 2, email: 'test2@email.com', sub: '32' },
			];
			expect(await controller.findAll({})).toEqual(result);
			expect(service.findAll).toHaveBeenCalled(); // Assert service method call
		});
	});

	describe('findOne', () => {
		it('should return a single user if found', async () => {
			const result = { id: 1, email: 'test@gmail.com', sub: 'ciao' };
			expect(await controller.findOne({ id: 1 }, requestMock)).toEqual(result);
			expect(service.findOne).toHaveBeenCalledWith(1); // Assert service method call
		});

		it('should throw NotFoundException if user is not found', async () => {
			expect(controller.findOne({ id: 2 }, requestMock)).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('create', () => {
		it('should create a user and return the created user object', async () => {
			const createUserDto: CreateUserDto = {
				email: 'test@email.com',
				sub: 'afdas31',
			};

			const response = await controller.create(createUserDto, responseMock);

			expect(response.status).toHaveBeenCalledWith(201);
			expect(response.setHeader).toHaveBeenCalledWith('Location', '/users/1');
			expect(response.send).toHaveBeenCalled();

			expect(service.create).toHaveBeenCalledWith(createUserDto); // Assert service method call
		});
	});

	describe('update', () => {
		it('should update a user and return the updated user object', async () => {
			const updateUserDto: UpdateUserDto = {
				email: 'updated@test.com',
			};
			const result = { id: 1, sub: 'ciao', email: 'updated@test.com' };

			expect(await controller.update({ id: 1 }, updateUserDto)).toEqual(result);
			expect(service.update).toHaveBeenCalledWith(1, updateUserDto); // Assert service method call
		});

		it('should throw NotFoundException if user is not found', async () => {
			const updateUserDto: UpdateUserDto = {
				email: 'updated@test.com',
			};

			expect(controller.update({ id: 2 }, updateUserDto)).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe('delete', () => {
		it('should delete a user and return the deleted user object', async () => {
			expect(await controller.delete({ id: 1 })).toEqual({
				id: 1,
				email: 'test@gmail.com',
				sub: 'ciao',
			});
			expect(service.delete).toHaveBeenCalledWith(1); // Assert service method call
		});

		it('should throw NotFoundException if user is not found', async () => {
			expect(controller.delete({ id: 2 })).rejects.toThrow(NotFoundException);
		});
	});
});

const mockUsersService = {
	findAll: jest.fn().mockImplementation(() => [
		{ id: 1, email: 'test@email.com', sub: '31' },
		{ id: 2, email: 'test2@email.com', sub: '32' },
	]),
	findOne: jest.fn().mockImplementation((id: number) => {
		if (id == 1) {
			return { id: 1, email: 'test@gmail.com', sub: 'ciao' };
		} else {
			return null;
		}
	}),
	create: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
		return {
			id: 1,
			...createUserDto,
		};
	}),
	update: jest
		.fn()
		.mockImplementation((id: number, updateUserDto: UpdateUserDto) => {
			if (id == 1) {
				return {
					id: 1,
					sub: 'ciao',
					...updateUserDto,
				};
			} else {
				return null;
			}
		}),
	delete: jest.fn().mockImplementation((id: number) => {
		if (id == 1) {
			return { id: 1, email: 'test@gmail.com', sub: 'ciao' };
		} else {
			return null;
		}
	}),
};
