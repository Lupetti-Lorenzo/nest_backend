import { Permissions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';
import { User } from './entities/user.entity';
import { Role } from '../../common/enums/role.enum';
import { UserContext } from '../../common/entities/user-context.entity';
import { Action } from '../../common/enums/action.enum';

export type Subjects = InferSubjects<typeof User>;

export const users_permissions: Permissions<
	Role,
	Subjects,
	Action,
	UserContext
> = {
	admin({ can }) {
		can(Action.Manage, User);
	},

	user({ user, can, cannot }) {
		can(Action.Read, User, { id: user.id });
		can(Action.Update, User, { id: user.id });
		cannot(Action.Update, User, ['sub']).because(
			'Cannot update sub as a normal User', // currently not working - forbidden instead
		); // limit user to update only email
		can(Action.Delete, User, { id: user.id });
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
