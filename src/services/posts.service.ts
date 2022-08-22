import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post } from '../interfaces/post.interface';
import { User } from '../interfaces/user.interface';
import { SocketsGateway } from 'src/sockets/sockets.gateway';
import { PostDto } from 'src/dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly Posts: Model<Post>,
    @InjectModel('User') private readonly Users: Model<User>,
    private readonly socketsGateway: SocketsGateway,
  ) {}

  // Get a specific post
  async getPost(id: string): Promise<any> {
    try {
      const post = await this.Posts.findById(id);
      return post;
    } catch (error) {
      return error;
    }
  }

  // Create a post
  async createPost(postDto: PostDto): Promise<any> {
    const userId = postDto.id;
    const title = postDto.title;
    const desc = postDto.desc;
    try {
      const newPost = await this.Posts.create({
        userId: userId,
        title: title,
        desc: desc,
      });

      this.socketsGateway.handleCreate(newPost, 'Post Created');

      return { success: true, post: newPost };
    } catch (error) {
      return error;
    }
  }

  // Update a post
  async updatePost(postId: string, postDto: PostDto): Promise<any> {
    const userId = postDto.id;
    const title = postDto.title;
    const desc = postDto.desc;
    try {
      const post = await this.Posts.findById(postId);
      const user = await this.Users.findById(userId);
      if (!(userId === post.userId.toString() || user.isModerator))
        throw new HttpException(
          'You can only update your post',
          HttpStatus.UNAUTHORIZED,
        );

      const updatedPost = await this.Posts.findByIdAndUpdate(postId, {
        $set: { title, desc },
      });
      this.socketsGateway.handleUpdate(updatedPost, 'Post Updated');
      return { success: true, post: updatedPost };
    } catch (error) {
      return error;
    }
  }

  // Delete a post
  async deletePost(postId: string, userId: string): Promise<any> {
    try {
      const post = await this.Posts.findById(postId);
      const user = await this.Users.findById(userId);
      if (!(userId === post.userId.toString() || user.isModerator))
        throw new HttpException(
          'You can only delete your post',
          HttpStatus.UNAUTHORIZED,
        );

      const deletedPost = await this.Posts.findByIdAndDelete(postId);
      this.socketsGateway.handleDelete(deletedPost, 'Post Deleted');
      return { success: true, post: deletedPost };
    } catch (error) {
      return error;
    }
  }
}
