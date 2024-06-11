// contains the data returned by the Logto API when a new user is created
export class AuthUser {
	id: string;
	username: string;
	primaryEmail: string;
	primaryPhone: string;
	name: string;
	avatar: string;
	customData: Record<string, any>;
	identities: Identity;
	lastSignInAt: number;
	createdAt: number;
	updatedAt: number;
	profile: Profile;
	applicationId: string;
	isSuspended: boolean;
	hasPassword: boolean;
	ssoIdentities: SSOIdentity[];
}

interface Address {
	formatted: string;
	streetAddress: string;
	locality: string;
	region: string;
	postalCode: string;
	country: string;
}

interface Profile {
	familyName: string;
	givenName: string;
	middleName: string;
	nickname: string;
	preferredUsername: string;
	profile: string;
	website: string;
	gender: string;
	birthdate: string;
	zoneinfo: string;
	locale: string;
	address: Address;
}

interface Identity {
	userId: string;
	details: Record<string, any>;
}

interface SSOIdentity {
	id: string;
	userId: string;
	issuer: string;
	identityId: string;
	detail: Record<string, any>;
	createdAt: number;
	ssoConnectorId: string;
}
