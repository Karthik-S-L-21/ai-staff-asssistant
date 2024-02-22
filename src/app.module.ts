import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './api/auth/auth.module';
import { ProjectModule } from './api/project/project.module';
import { UserModule } from './api/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtAuthModule } from './utils/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env['MONGO_DB_URI']),
    JwtAuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    ProjectModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, PassportModule, JwtModule],
})
export class AppModule {}
