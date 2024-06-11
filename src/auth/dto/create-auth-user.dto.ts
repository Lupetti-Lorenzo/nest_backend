// contains the necessary data to create a new user in Logto
export class CreateAuthUserDto {
	primaryEmail: string;
	username: string;
	password: string;
	name: string;
}
