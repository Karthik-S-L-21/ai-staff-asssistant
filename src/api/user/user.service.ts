import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { User } from './schemas/user.schema';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<User | null>,
  ) {}
  async getUserDetails(
    filter: FilterQuery<User>,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>,
  ): Promise<User> {
    return await this.userModel.findOne(filter, projection, options);
  }
}
