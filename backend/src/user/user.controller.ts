import {
  Get,
  Controller,
  UsePipes,
  Body,
  ValidationPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/CreateUserDTO';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async getUsers() {
    return this.userService.findAllUsers();
  }

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() user: CreateUserDTO) {
    return this.userService.createUser(user.name, user.email, user.password);
  }
}
