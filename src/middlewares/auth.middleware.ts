import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.body.token || req.header('Authorization');

      if (!token)
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized client',
          },
          HttpStatus.UNAUTHORIZED,
        );
      const splitToken = token.split(' ')[1];
      const verified = jwt.verify(splitToken, process.env.JWT_SECRET);
      req.body = { ...req.body, verified: verified };
      next();
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
