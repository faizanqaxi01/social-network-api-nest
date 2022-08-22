import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Post } from '../interfaces/post.interface';

@WebSocketGateway()
export class SocketsGateway {
  @WebSocketServer()
  private server;

  // For creating posts
  handleCreate(post: Post, message: string) {
    this.server.emit('postCreate', message, post);
  }

  // For updating posts
  handleUpdate(post: Post, message: string) {
    this.server.emit('postUpdate', message, post);
  }

  // For deleting posts
  handleDelete(post: Post, message: string) {
    this.server.emit('postDelete', message, post);
  }

  // For client connection
  handleConnection(client: any) {
    console.log('Client connected through socket: ', client);
  }
}
