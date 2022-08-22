import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FollowController } from '../controllers/follow.controller';
import { FollowService } from '../services/follow.service';
import { UserSchema } from '../models/users.model';
import { PostSchema } from 'src/models/posts.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Post', schema: PostSchema },
    ]),
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
