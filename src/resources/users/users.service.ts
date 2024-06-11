import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { users } from '../../database/schema';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
	constructor(private dbService: DatabaseService) {}

	async findAll() {
		return await this.dbService.drizzle.query.users.findMany();
	}

	async findOne(id: number): Promise<User> {
		const user: User = await this.dbService.drizzle.query.users.findFirst({
			where: (user) => eq(user.id, id),
		});
		return new User(user.id, user.email, user.sub);
	}

	async create(user: CreateUserDto): Promise<User> {
		const [newUser] = await this.dbService.drizzle
			.insert(users)
			.values({ email: user.email, sub: user.sub })
			.returning();
		return newUser;
	}

	async update(id: number, user: UpdateUserDto): Promise<User> {
		const [updatedUser] = await this.dbService.drizzle
			.update(users)
			.set({ email: user.email })
			.where(eq(users.id, id))
			.returning();
		return updatedUser;
	}

	async delete(id: number): Promise<User> {
		const [deletedUser] = await this.dbService.drizzle
			.delete(users)
			.where(eq(users.id, id))
			.returning();
		return deletedUser;
	}
}
