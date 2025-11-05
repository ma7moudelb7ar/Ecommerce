import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: 'MatchFields', async: false })
export class MatchFields implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
    return value === args.object[args.constraints[0]]
}

    defaultMessage(args: ValidationArguments) {
    return `${args.constraints[0]} Not Match ${args.property}`;
}
}

export function Match (constraints : string[],validationOptions?: ValidationOptions) {
return function (object: Object, propertyName: string) {
    registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints,
        validator: MatchFields,
    });
};
}
