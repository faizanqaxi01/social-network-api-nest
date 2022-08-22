import { Controller, Body, Param, Get } from '@nestjs/common';

import { FeedService } from '../services/feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('/:id')
  async getFeed(
    @Param('id') userId: string,
    @Body('param') param: string,
    @Body('order') order: number,
    @Body('page') page: number,
  ) {
    const result = await this.feedService.getFeed(userId, param, order, page);
    return result;
  }
}
