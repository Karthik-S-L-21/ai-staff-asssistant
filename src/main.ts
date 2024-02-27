import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(corsConfig);
  app.use(cookieParser()); // cookie parser middleware
  await app.listen(process.env.PORT || 3000);
  console.log(`App Running on port ${process.env.PORT}`);
}
bootstrap();
