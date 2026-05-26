import {
  registerDecorator,
  type ValidationOptions,
  type ValidationArguments,
} from 'class-validator';

/**
 * Проверяет, что дата в ISO-формате не находится в будущем.
 */
export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isNotFutureDate',
      target: object.constructor,
      propertyName,
      options: {
        message: 'Дата не может быть в будущем',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return false;
          const date = new Date(value);
          if (Number.isNaN(date.getTime())) return false;
          return date <= new Date();
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} не может быть в будущем`;
        },
      },
    });
  };
}
