import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly Users: Model<User>) {}

  // Get a specific user
  async getUser(id: string): Promise<any> {
    try {
      const user = await this.Users.findOne({ _id: id });
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        followers: user.followers,
        following: user.following,
      };
    } catch (error) {
      return error;
    }
  }

  // To update a user
  async updateUser(
    id: string,
    body: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    },
  ): Promise<any> {
    try {
      const user = await this.Users.findByIdAndUpdate(id, {
        $set: body,
      });

      return {
        success: true,
        msg: 'User updated successfully',
        user: user,
      };
    } catch (error) {
      return error;
    }
  }

  // To delete a user
  async deleteUser(id: string): Promise<any> {
    try {
      const user = await this.Users.findByIdAndDelete(id);
      if (user === null)
        return {
          success: true,
          msg: 'User deleted successfully',
          user: user,
        };
    } catch (error) {
      return error;
    }
  }
}
