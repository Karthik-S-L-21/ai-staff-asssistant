import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../api/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      try {
        const user = await this.authService.validateUserByToken(token);
        if (user) {
          req.user = user;
        }
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }

    next();
  }
}
