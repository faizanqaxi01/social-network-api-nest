import { Controller, Delete, Post, Body, Param } from '@nestjs/common';

import { FollowService } from '../services/follow.service';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('/:id')
  async followUser(
    @Body('userId') userId: string,
    @Param('id') idToFollow: string,
  ) {
    const result = await this.followService.followUser(userId, idToFollow);
    return result;
  }
  @Delete('/:id')
  async unfollowUser(
    @Body('userId') userId: string,
    @Param('id') idToUnfollow: string,
  ) {
    const result = await this.followService.unfollowUser(userId, idToUnfollow);
    return result;
  }
}
