import { Body, Controller, NotFoundException, Post, Res } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (user) {
      const token = await this.authService.generateToken(loginDto);
      return res.json({ token });
    } else {
      throw new NotFoundException({ message: 'User not Found' });
    }
  }
}
