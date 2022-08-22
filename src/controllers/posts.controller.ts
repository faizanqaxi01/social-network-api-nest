import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { PostDto } from 'src/dto/post.dto';
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/:id')
  async postGet(@Param('id') id: string) {
    return await this.postsService.getPost(id);
  }

  @Post('/')
  async createPost(@Body() postDto: PostDto) {
    return await this.postsService.createPost(postDto);
  }

  @Patch('/:id')
  async updatePost(@Param('id') postId: string, @Body() postDto: PostDto) {
    return await this.postsService.updatePost(postId, postDto);
  }

  @Delete('/:id')
  async deletePost(
    @Body('userId') userId: string,
    @Param('id') postId: string,
  ) {
    return await this.postsService.deletePost(userId, postId);
  }
}
