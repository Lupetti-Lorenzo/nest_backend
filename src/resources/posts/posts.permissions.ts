import { Permissions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { Role } from '../../common/enums/role.enum';
import { UserContext } from '../../common/entities/user-context.entity';
import { Action } from '../../common/enums/action.enum';
import { Post } from './entities/post.entity';

export type Subjects = InferSubjects<typeof Post>;

export const posts_permissions: Permissions<
	Role,
	Subjects,
	Action,
	UserContext
> = {
	admin({ can }) {
		can(Action.Manage, Post);
	},

	user({ user, can, cannot }) {
		can(Action.Read, Post, { user_id: user.id });
		can(Action.Update, Post, { user: user.id });
		can(Action.Delete, Post, { user_id: user.id });
	},
	// editor({ user, can }) {
	// 	can(Action.Read, User, {
	// 		organization_id: {
	// 			$in: user.organizations,
	// 		},
	// 	});
	// },

	// everyone({ can }) {
	// 	can(Actions.read, User);
	// 	can(Actions.create, User);
	// },
	// operator({ can, cannot, extend }) {
	// 	extend(Roles.customer);

	// 	can(Actions.manage, PostCategory);
	// 	can(Actions.manage, Post);
	// 	cannot(Actions.delete, Post);
	// },
};
