import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './modules/users.module';
import { PostsModule } from './modules/posts.module';
import { PaymentModule } from './modules/payments.module';
import { FollowModule } from './modules/follow.module';
import { FeedModule } from './modules/feed.module';
import { AuthMiddleware } from './middlewares/auth.middleware';

import { SocketsModule } from './modules/sockets.module';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    PaymentModule,
    FollowModule,
    FeedModule,
    SocketsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_DB_URI'),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        'users',
        'users/:id',
        'posts',
        'posts/:id',
        'payment',
        'follow/:id',
        'feed/:id',
      );
  }
}
