export class User {
	id: number;
	sub: string;
	email: string;

	constructor(id: number, email: string, sub: string) {
		this.id = id;
		this.email = email;
		this.sub = sub;
	}
}
