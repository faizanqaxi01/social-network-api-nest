import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from '../interfaces/user.interface';

@Injectable()
export class FollowService {
  constructor(@InjectModel('User') private readonly Users: Model<User>) {}

  // To follow a user
  async followUser(currentId: string, toFollowId: string): Promise<any> {
    try {
      // Get the user to follow
      let toFollow = await this.Users.findOne({ _id: toFollowId });

      // Get the current user
      let user = await this.Users.findOne({ _id: currentId });

      // if already following
      if (user.following.includes(toFollowId))
        throw new HttpException('Already Following', HttpStatus.BAD_REQUEST);

      // update the following of current user - add to following
      user.following.push(toFollow._id.toString());

      // save the current user
      user = await user.save();

      // update the followers of toFollow user - add to followers
      toFollow.followers.push(user._id.toString());

      // save the toFollow user
      toFollow = await toFollow.save();

      // return the response
      return {
        success: true,
        msg: 'Followed successfully',
        user: user,
      };
    } catch (error) {
      return error;
    }
  }

  // To unfollow a user
  async unfollowUser(currentId: string, toUnfollowId: string): Promise<any> {
    try {
      // Get the user to follow
      let toUnfollow = await this.Users.findOne({ _id: toUnfollowId });

      // Get the current user
      let user = await this.Users.findOne({ _id: currentId });

      // if not following
      if (user.following.includes(toUnfollowId))
        throw new HttpException('Not Following', HttpStatus.BAD_REQUEST);

      // update the following of current user - Remove from following
      user.following = user.following.filter(
        (item) => item.toString() != toUnfollow._id.toString(),
      );

      // save the current user
      user = await user.save();

      // update the followers of toUnfollow user - remove from followers
      toUnfollow.followers = toUnfollow.followers.filter(
        (item) => item.toString() !== user._id.toString(),
      );

      // save the toUnfollow user
      toUnfollow = await toUnfollow.save();

      // return the response
      return {
        success: true,
        msg: 'Unfollowed successfully',
        user: user,
      };
    } catch (error) {
      return error;
    }
  }
}
