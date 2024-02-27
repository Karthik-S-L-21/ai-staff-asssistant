import { Controller, Get } from '@nestjs/common';
import { ExtractKeyFromRequest } from '../../decorators/user-decorator';
import { SuccessResponseType, UserRequestType } from '../@types';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  async fetchUserDetails(
    @ExtractKeyFromRequest('user') user: UserRequestType,
  ): Promise<SuccessResponseType<User>> {
    const userData = await this.userService.getUserDetails(user);
    return {
      statusCode: 200,
      message: `User info fetched successfully`,
      result: userData,
    };
  }
}
