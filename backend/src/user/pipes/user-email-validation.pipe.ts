import { PipeTransform, BadRequestException } from '@nestjs/common';

export class UserEmailValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!isEmail(value)) {
      throw new BadRequestException('Invalid email address');
    }
    return value;
  }
}

function isEmail(value: string) {
  const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regExp.test(value);
}
