/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command, CommandRunner, Option } from 'nest-commander';
import { UsersService } from '../../resources/users/users.service';
import * as fs from 'fs';
import { CreateUserDto } from '../../resources/users/dto/create-user.dto';

interface SeedingOptions {
	seed_path: string;
}

function validateUsers(users: any): CreateUserDto[] {
	// check if array
	if (!Array.isArray(users)) {
		throw new Error('Invalid user data, need to be an array.');
	}
	const validUsers: CreateUserDto[] = [];
	users.forEach((user: any) => {
		const validUser: CreateUserDto = {
			email: user.email,
			sub: user.sub,
		};

		if (!validUser.email || !validUser.sub) {
			throw new Error('Invalid user data, need to have email and sub fields.');
		}
		validUsers.push(validUser);
	});
	return validUsers as CreateUserDto[];
}

@Command({
	name: 'seed_users',
	description: 'Initial seeding for dev and test containers.',
	options: {},
})
export class SeedUsersCommand extends CommandRunner {
	constructor(private readonly userService: UsersService) {
		super();
	}

	async run(_passedParams: string[], options: SeedingOptions): Promise<void> {
		const users = await this.userService.findAll();
		if (users.length > 0) {
			console.log('Users already seeded');
			return;
		}
		fs.readFile(options.seed_path, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			const users = JSON.parse(data);

			const usersValidated: CreateUserDto[] = validateUsers(users);

			usersValidated.forEach(async (user: any) => {
				await this.userService.create(user);
			});
		});
	}

	@Option({
		flags: '-sp, --seed_path <seed_path>',
		description: 'File path with the schemas of the user data to be seeded',
		required: true,
	})
	parsePath(seed_path: string) {
		return seed_path;
	}
}
