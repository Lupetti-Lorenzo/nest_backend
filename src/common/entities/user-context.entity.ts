import { AuthorizableUser } from 'nest-casl';
import { Role } from '../enums/role.enum';

export class UserContext implements AuthorizableUser<Role, number> {
	id: number;
	username: string;
	roles: Array<Role>;
	organizationId?: string;
}
