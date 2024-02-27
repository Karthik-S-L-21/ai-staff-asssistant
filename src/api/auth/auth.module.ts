import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';
import { RefreshJwtStrategy } from './strategies/refresh-token-strategy';
import { AuthMiddleware } from '../../middlewares/auth.middleware';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '200s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
