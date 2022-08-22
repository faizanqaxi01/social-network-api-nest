import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/users.module';
import { PostsModule } from './modules/posts.module';
import { PaymentModule } from './modules/payments.module';
import { FollowModule } from './modules/follow.module';
import { FeedModule } from './modules/feed.module';
import { IndexModule } from './modules/index.module';
import { AuthMiddleware } from './middlewares/auth.middleware';

import { SocketsModule } from './modules/sockets.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PostsModule,
    PaymentModule,
    FollowModule,
    FeedModule,
    IndexModule,
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
