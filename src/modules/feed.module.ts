import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FeedController } from '../controllers/feed.controller';
import { FeedService } from '../services/feed.service';
import { UserSchema } from '../models/users.model';
import { PostSchema } from '../models/posts.model';

import { SocketsGateway } from '../sockets/sockets.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Post', schema: PostSchema },
    ]),
  ],
  controllers: [FeedController],
  providers: [FeedService, SocketsGateway],
})
export class FeedModule {}
