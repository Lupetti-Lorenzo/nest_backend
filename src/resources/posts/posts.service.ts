import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreatePostDto } from './dto/create-post.dto';
import { posts } from '../../database/schema';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { eq, sql } from 'drizzle-orm';
import { SqlConditions } from 'nest-casl/dist/proxies/conditions.proxy';
import {
	fromConditionsToWhere,
	mongoToSqlWhereClause,
} from '../../common/utility/filter.utility';

@Injectable()
export class PostsService {
	constructor(private dbService: DatabaseService) {}

	// da fare oggetto con interfaccia - findalloptions, permissions: SqlConditions, filter: ...
	// cambiare nome ecc
	async findAll(casl_sql_permissions?) {
		const query = mongoToSqlWhereClause(casl_sql_permissions);
		console.log('query:', query);
		return await this.dbService.drizzle.query.posts.findMany({
			where: sql.raw(query),
		});
	}

	async findOne(id: number): Promise<Post> {
		return await this.dbService.drizzle.query.posts.findFirst({
			where: (post) => eq(post.id, id),
		});
	}

	async create(post: CreatePostDto): Promise<Post> {
		const [newPost] = await this.dbService.drizzle
			.insert(posts)
			.values({ user_id: post.user_id, title: post.title })
			.returning();
		return newPost;
	}

	async update(id: number, post: UpdatePostDto): Promise<Post> {
		const [updatedPost] = await this.dbService.drizzle
			.update(posts)
			.set({ title: post.title })
			.where(eq(posts.id, id))
			.returning();
		return updatedPost;
	}

	async delete(id: number): Promise<Post> {
		const [deletedPost] = await this.dbService.drizzle
			.delete(posts)
			.where(eq(posts.id, id))
			.returning();
		return deletedPost;
	}
}
