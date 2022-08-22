import { Controller, Delete, Patch, Body, Param, Get } from '@nestjs/common';

import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  async userGet(@Param('id') id: string) {
    return await this.usersService.getUser(id);
  }

  @Patch('/:id')
  async userUpdate(
    @Param('id') id: string,
    @Body('firstName') firstName?: string,
    @Body('lastName') lastName?: string,
    @Body('email') email?: string,
    @Body('password') password?: string,
  ) {
    const result = await this.usersService.updateUser(id, {
      firstName,
      lastName,
      email,
      password,
    });
    return result;
  }

  @Delete('/:id')
  async userDelete(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
