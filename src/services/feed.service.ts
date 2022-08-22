import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from '../interfaces/post.interface';
import { User } from '../interfaces/user.interface';
import { SocketsGateway } from '../sockets/sockets.gateway';
@Injectable()
export class FeedService {
  PER_PAGE_ITEMS = 3;

  constructor(
    @InjectModel('Post') private readonly Posts: Model<Post>,
    @InjectModel('User') private readonly Users: Model<User>,
    private readonly socketsGateway: SocketsGateway,
  ) {}

  // To follow a user
  async getFeed(
    userId: string,
    param: string,
    order: number,
    pageNumber: number,
  ): Promise<any> {
    const orderSort = {};
    orderSort[param] = order;

    const user = await this.Users.findOne({ _id: userId });
    if (user.type === 'unpaid')
      throw new HttpException('Unauthorized Client', HttpStatus.UNAUTHORIZED);

    const { following } = user;

    const postsCount: number = await this.Posts.find({
      userId: { $in: following },
    }).count();

    if (pageNumber * this.PER_PAGE_ITEMS >= postsCount + this.PER_PAGE_ITEMS)
      throw new HttpException(
        'Requested page does not exist',
        HttpStatus.NOT_FOUND,
      );

    const posts = await this.Posts.find({ userId: { $in: following } })
      .sort(orderSort)
      .skip((pageNumber - 1) * this.PER_PAGE_ITEMS)
      .limit(this.PER_PAGE_ITEMS);

    if (!posts) throw new HttpException('No posts found', HttpStatus.NOT_FOUND);

    return {
      success: true,
      posts,
      totalPosts: postsCount,
      nextPage: Number(pageNumber) + 1,
      hasNextPage: pageNumber * this.PER_PAGE_ITEMS < postsCount,
      hasPrevPage: pageNumber > 1,
    };
  }
}
