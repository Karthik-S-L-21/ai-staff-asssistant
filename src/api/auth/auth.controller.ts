import { Body, Controller, NotFoundException, Post, Res } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const loginResponse = await this.authService.login(loginDto);
    if (loginResponse) {
      return res.send({
        message: 'Logged in Successfully',
      });
    } else {
      throw new NotFoundException({ message: 'User not Found' });
    }
  }
}
