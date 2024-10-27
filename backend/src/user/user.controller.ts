import { Get, Controller, Param, UsePipes, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEmailValidationPipe } from './pipes/user-email-validation.pipe';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async getUsers() {
    return this.userService.findAllUsers();
  }

  @UsePipes(UserEmailValidationPipe)
  @Get('create')
  async createUser(@Query('email') email: string) {
    return this.userService.createUser('John Doe', email, 'password');
  }
}
