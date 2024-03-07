import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { FreezeProjectDto } from '../project/dto/freeze_list.dto';
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

  async updateUserDetails(
    filter?: FilterQuery<User>,
    update?: UpdateQuery<User>,
    options?: any,
  ): Promise<ReturnType<(typeof Model)['updateOne']>> {
    return await this.userModel.updateOne(filter, update, options).exec();
  }

  async updateUserUsingCompanyId(
    companyId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updateQuery: any = {};

    const propertyMappings = {
      name: 'name',
      email: 'email',
      phone_number: 'phone_number',
      designation: 'designation',
      stream: 'stream',
      experience: 'experience',
      allocated: 'allocated',
      current_allocated_projects: 'current_allocated_projects',
      allocated_percentage: 'allocated_percentage',
      primary_skill: 'primary_skill',
      secondary_skill: 'secondary_skill',
      role: 'role',
    };

    Object.keys(updateUserDto).forEach((key) => {
      const mappedField = propertyMappings[key];
      if (mappedField !== undefined) {
        updateQuery[mappedField] = updateUserDto[key];
      }
    });

    await this.updateUserDetails(
      { companyId: companyId },
      { $set: updateQuery },
    );

    const updatedUser = await this.getUserDetails({ companyId: companyId });

    return updatedUser;
  }

  async updateUserUsingName(
    name: string,
    freezeProjectDto: FreezeProjectDto,
  ): Promise<User> {
    const updateQuery: any = { freeze_status: true };

    await this.updateUserDetails({ name: name }, { $set: updateQuery });

    const updatedUser = await this.getUserDetails({ name: name });

    return updatedUser;
  }
}
