import { Module, forwardRef } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './schema/project.schema';
import { HttpModule } from '@nestjs/axios';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
    HttpModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, UserService],
})
export class ProjectModule {}
