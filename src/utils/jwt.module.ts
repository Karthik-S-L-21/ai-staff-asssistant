import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtMiddleware } from '../middlewares/jwt.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: 'egt532@y',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [JwtService],
  exports: [JwtService, PassportModule],
})
export class JwtAuthModule {}
