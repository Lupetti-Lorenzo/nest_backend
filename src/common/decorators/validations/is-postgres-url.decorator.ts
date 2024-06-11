/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

export function IsPostgresUrl(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'IsPostgresUrl',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: IsPostgresUrlConstraint,
		});
	};
}

@ValidatorConstraint({ name: 'IsPostgresUrl' })
export class IsPostgresUrlConstraint implements ValidatorConstraintInterface {
	validate(value: any, args: ValidationArguments) {
		if (typeof value !== 'string') {
			return false;
		}

		// Regular expression to match PostgreSQL URL
		const postgresUrlPattern =
			/^postgres(?:ql)?:\/\/(?:[^:@\/]+(?::[^:@\/]*)?@)?(?:\[[^\]]+\]|[^:\/?#]+)(?::\d*)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/;
		return postgresUrlPattern.test(value);
	}

	defaultMessage(args: ValidationArguments) {
		return 'Invalid PostgreSQL URL';
	}
}
