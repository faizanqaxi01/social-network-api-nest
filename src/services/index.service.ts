import { Injectable } from '@nestjs/common';

@Injectable()
export class IndexService {
  getServer() {
    return {
      success: true,
      msg: 'Server Running',
    };
  }
}
